import { useState, useEffect, useCallback } from "react";
import { useGetHealthIssuesQuery, useLazySearchHealthIssuesQuery } from "../store/api/healthIssuesApi";
import LogHealthIssueModal from "../components/HealthIssues/LogHealthIssueModal";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import HealthIssueList from "../components/HealthIssues/HealthIssueList";
import HealthIssuesHeader from "../components/HealthIssues/HealthIssuesHeader";
import MainLayout from '../layouts/MainLayout';

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
  // RTK Query hooks
  const { data: healthIssuesData, isLoading, error: fetchError, refetch } = useGetHealthIssuesQuery();
  const [searchHealthIssues, { data: searchData, isLoading: isSearchLoading }] = useLazySearchHealthIssuesQuery();
  
  const [healthIssues, setHealthIssues] = useState([]);
  const [allHealthIssues, setAllHealthIssues] = useState([]); // Store all issues for client-side filtering
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Load health issues when data is available from RTK Query
  useEffect(() => {
    if (healthIssuesData) {
      const issues = Array.isArray(healthIssuesData) ? healthIssuesData : [];
      setAllHealthIssues(issues);
      setHealthIssues(issues);
      setError(null);
    } else if (fetchError) {
      console.error("Error loading health issues:", fetchError);
      setError("Failed to load health issues");
      setAllHealthIssues([]);
      setHealthIssues([]);
    }
  }, [healthIssuesData, fetchError]);

  // Update health issues when search results are available
  useEffect(() => {
    if (searchData) {
      // Apply active filter to search results if needed
      const filteredResults = activeFilter !== 'all' 
        ? searchData.filter(issue => issue.status === activeFilter)
        : searchData;
      
      setHealthIssues(filteredResults);
      setIsSearching(false);
    }
  }, [searchData, activeFilter]);

  const handleAddHealthIssue = async () => {
    // Refetch health issues after adding new one
    await refetch();
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
      // Use RTK Query lazy search hook
      await searchHealthIssues(query);
    } catch (err) {
      console.error("Error searching health issues:", err);
      // Don't show error to user for search failures, just fall back to local filtering
      applyFilters(query, activeFilter);
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

  if (isLoading || isSearchLoading || isSearching) {
    return (
      <MainLayout>
        <div className="p-6">
          <HealthIssuesHeader 
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            activeFilter={activeFilter}
          />
          <div className="flex justify-center items-center mt-12">
            <LoadingSpinner />
            <span className="ml-3 text-gray-600">
              {isLoading ? "Loading health issues..." : "Searching..."}
            </span>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="p-6">
          <HealthIssuesHeader 
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            activeFilter={activeFilter}
          />
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
            <button 
              onClick={refetch}
              className="mt-2 bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!healthIssues || healthIssues.length === 0) {
    return (
      <MainLayout>
        <div className="p-6">
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
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6">
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
    </MainLayout>
  );
};

export default HealthIssues;
