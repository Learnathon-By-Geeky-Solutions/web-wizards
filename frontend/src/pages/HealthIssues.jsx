import { useState, useEffect, useCallback } from "react";
import { fetchHealthIssues, searchHealthIssues } from "../api/healthIssuesApi";
import LogHealthIssueModal from "../components/HealthIssues/LogHealthIssueModal";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import HealthIssueList from "../components/HealthIssues/HealthIssueList";
import HealthIssuesHeader from "../components/HealthIssues/HealthIssuesHeader";
import Sidebar from '../components/Sidebar';

// Helper function to debounce API calls
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const HealthIssues = () => {
  const [healthIssues, setHealthIssues] = useState([]);
  const [allHealthIssues, setAllHealthIssues] = useState([]); // Store all issues for client-side filtering
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Load all health issues on component mount
  useEffect(() => {
    loadHealthIssues();
  }, []);

  const loadHealthIssues = async () => {
    try {
      setLoading(true);
      const data = await fetchHealthIssues();
      const issues = Array.isArray(data) ? data : [];
      setAllHealthIssues(issues); // Keep original list for client-side filtering
      setHealthIssues(issues);
      setError(null);
    } catch (err) {
      console.error("Error loading health issues:", err);
      setError("Failed to load health issues");
      setAllHealthIssues([]);
      setHealthIssues([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHealthIssue = async () => {
    await loadHealthIssues(); // Reload the list after adding
    setIsModalOpen(false);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    applyFilters(searchQuery, filter);
  };

  // Perform API search if query is 3 or more characters, otherwise filter locally
  const performSearch = async (query) => {
    if (!query.trim()) {
      // If search is cleared, restore all health issues with active filter only
      applyFilters('', activeFilter);
      return;
    }
    
    // For short queries, filter client-side for better performance
    if (query.trim().length < 3) {
      applyFilters(query, activeFilter);
      return;
    }
    
    try {
      setIsSearching(true);
      const results = await searchHealthIssues(query);
      
      // Apply active filter to search results if needed
      const filteredResults = activeFilter !== 'all' 
        ? results.filter(issue => issue.status === activeFilter)
        : results;
      
      setHealthIssues(filteredResults);
      setError(null);
    } catch (err) {
      console.error("Error searching health issues:", err);
      // Don't show error to user for search failures, just fall back to local filtering
      applyFilters(query, activeFilter);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Debounced search function to limit API calls
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query) => performSearch(query), 300),
    [activeFilter, allHealthIssues] // Dependencies that would affect the search
  );

  // Handler for search input changes
  const handleSearch = (query) => {
    setSearchQuery(query);
    
    // Immediately apply client-side filtering for responsive UI
    if (!query.trim() || query.trim().length < 3) {
      applyFilters(query, activeFilter);
    } else {
      // For longer queries, use the debounced search for API calls
      debouncedSearch(query);
    }
  };

  // Apply filters locally for better performance
  const applyFilters = (query, filter) => {
    const searchLower = query.toLowerCase();
    const filtered = allHealthIssues.filter(issue => {
      // Filter by status
      if (filter !== 'all' && issue.status !== filter) {
        return false;
      }
      
      // Filter by search query (if any)
      if (query) {
        return (
          issue.title?.toLowerCase().includes(searchLower) ||
          issue.description?.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
    
    setHealthIssues(filtered);
  };

  // Replace the old filteredIssues with direct use of healthIssues
  // which is already filtered by the handleSearch and handleFilterChange functions
  const filteredIssues = healthIssues;

  if (loading || isSearching) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 ml-64 p-6">
          <HealthIssuesHeader 
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            activeFilter={activeFilter}
          />
          <div className="flex justify-center items-center mt-12">
            <LoadingSpinner />
            <span className="ml-3 text-gray-600">
              {loading ? "Loading health issues..." : "Searching..."}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 ml-64 p-6">
          <HealthIssuesHeader 
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            activeFilter={activeFilter}
          />
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
            <button 
              onClick={loadHealthIssues}
              className="mt-2 bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!healthIssues || healthIssues.length === 0) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 ml-64 p-6">
          <HealthIssuesHeader 
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            activeFilter={activeFilter}
          />
          
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md"
            >
              Log Health Issue
            </button>
          </div>
          
          {searchQuery || activeFilter !== 'all' ? (
            <EmptyState 
              title={`No ${activeFilter !== 'all' ? activeFilter : ''} health issues found`}
              description={searchQuery 
                ? `No results match "${searchQuery}"${activeFilter !== 'all' ? ` with status "${activeFilter}"` : ''}. Try a different search term or filter.`
                : `No health issues with status "${activeFilter}" found. Try a different filter or create a new health issue.`
              }
              icon="search"
            />
          ) : (
            <EmptyState 
              title="No health issues"
              description="You haven't logged any health issues yet. Click the button above to log your first health issue."
              icon="health"
            />
          )}
          
          {isModalOpen && (
            <LogHealthIssueModal
              onClose={() => setIsModalOpen(false)}
              onSuccess={handleAddHealthIssue}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Health Issues</h1>
        
        <HealthIssuesHeader 
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          activeFilter={activeFilter}
        />
        
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md"
          >
            Log Health Issue
          </button>
        </div>

        <HealthIssueList issues={filteredIssues} />

        {isModalOpen && (
          <LogHealthIssueModal
            onClose={() => setIsModalOpen(false)}
            onSuccess={handleAddHealthIssue}
          />
        )}
      </div>
    </div>
  );
};

export default HealthIssues;
