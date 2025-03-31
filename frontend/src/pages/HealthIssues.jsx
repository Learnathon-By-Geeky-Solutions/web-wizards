import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { fetchHealthIssues } from '../api/healthIssuesApi';
import LogHealthIssueModal from '../components/HealthIssues/LogHealthIssueModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

const HealthIssues = () => {
  const [healthIssues, setHealthIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogModal, setShowLogModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadHealthIssues();
  }, []);

  useEffect(() => {
    filterHealthIssues();
  }, [healthIssues, searchQuery, statusFilter]);

  const loadHealthIssues = async () => {
    try {
      setIsLoading(true);
      const data = await fetchHealthIssues();
      setHealthIssues(data);
    } catch (error) {
      console.error('Failed to load health issues:', error);
      toast.error('Failed to load health issues');
      setHealthIssues([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterHealthIssues = () => {
    let filtered = [...healthIssues];
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(issue => issue.status === statusFilter);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(issue => 
        issue.title.toLowerCase().includes(query) || 
        (issue.description && issue.description.toLowerCase().includes(query))
      );
    }
    
    setFilteredIssues(filtered);
  };

  const handleLogSuccess = (newIssue) => {
    setHealthIssues(prev => [newIssue, ...prev]);
    setShowLogModal(false);
    toast.success('Health issue logged successfully');
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-red-100 text-red-800';
      case 'monitoring':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Health Issues</h1>
        <button
          onClick={() => setShowLogModal(true)}
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FaPlus className="mr-2" /> Log Health Issue
        </button>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search health issues..."
                className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <label className="inline-flex items-center">
                <span className="text-gray-700 mr-2">Status:</span>
                <select
                  className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Issues</option>
                  <option value="active">Active</option>
                  <option value="monitoring">Monitoring</option>
                  <option value="resolved">Resolved</option>
                </select>
              </label>
            </div>
          </div>
        </div>
        
        {/* Health Issues List */}
        {isLoading ? (
          <div className="p-8 flex justify-center">
            <LoadingSpinner size="large" />
          </div>
        ) : filteredIssues.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredIssues.map((issue) => (
              <li key={issue.id} className="hover:bg-gray-50">
                <Link to={`/health-issues/${issue.id}`} className="block p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center mb-1">
                        <h3 className="text-lg font-medium text-gray-900 mr-3">{issue.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(issue.status)}`}>
                          {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Started on {formatDate(issue.start_date)}
                        {issue.status === 'resolved' && issue.end_date && (
                          <span> · Ended on {formatDate(issue.end_date)}</span>
                        )}
                      </p>
                      {issue.description && (
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{issue.description}</p>
                      )}
                    </div>
                    <div className="ml-4">
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="No health issues found"
            description={
              searchQuery || statusFilter !== 'all'
                ? "Try adjusting your search criteria"
                : "Log your first health issue to start tracking"
            }
            actionLabel={
              searchQuery || statusFilter !== 'all'
                ? "Clear filters"
                : "Log Health Issue"
            }
            actionFn={
              searchQuery || statusFilter !== 'all'
                ? () => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }
                : () => setShowLogModal(true)
            }
            icon="medical"
          />
        )}
      </div>
      
      {showLogModal && (
        <LogHealthIssueModal 
          onClose={() => setShowLogModal(false)}
          onSuccess={handleLogSuccess}
        />
      )}
    </div>
  );
};

export default HealthIssues;
