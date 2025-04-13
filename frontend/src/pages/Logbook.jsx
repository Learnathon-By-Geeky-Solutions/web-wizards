import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { useLocation, useSearchParams } from 'react-router-dom';
import { 
  useGetHealthIssuesQuery, 
  useGetHealthIssueLogEntriesQuery 
} from '../store/api/healthIssuesApi';
import { setCurrentPage } from '../store/slices/logbookSlice';
import { FaPlus } from 'react-icons/fa';
import VitalsModal from '../components/MedicalRecord/Logbook/VitalsModal';

const Logbook = () => {
  const dispatch = useDispatch();
  const { currentPage } = useSelector(state => state.logbook);
  const [selectedHealthIssue, setSelectedHealthIssue] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({
    from: '',
    to: ''
  });
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Extract health issue ID from URL parameters or router state
  useEffect(() => {
    const issueId = searchParams.get('issueId');
    if (issueId) {
      setSelectedHealthIssue(issueId);
    } else if (location.state?.currentIssue?.id) {
      setSelectedHealthIssue(location.state.currentIssue.id);
    }
  }, [searchParams, location.state]);

  // Fetch health issues with loading and error states
  const { 
    data: healthIssues = [], 
    isLoading: isLoadingHealthIssues,
    error: healthIssuesError
  } = useGetHealthIssuesQuery();

  // Fetch log entries for selected health issue with proper error handling
  const { 
    data: logEntries = [], 
    isLoading: isLoadingLogs,
    error: logEntriesError 
  } = useGetHealthIssueLogEntriesQuery(
    selectedHealthIssue !== 'all' ? selectedHealthIssue : null
  );

  const handleHealthIssueChange = (e) => {
    setSelectedHealthIssue(e.target.value);
  };

  const handleDateChange = (field) => (e) => {
    setDateRange(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredLogs = (logEntries || []).filter(log => {
    // Filter by date range
    if (dateRange.from || dateRange.to) {
      const logDate = new Date(log.created_at);
      const fromDate = dateRange.from ? new Date(dateRange.from) : null;
      const toDate = dateRange.to ? new Date(dateRange.to) : null;

      if (fromDate && toDate) {
        if (!(logDate >= fromDate && logDate <= toDate)) return false;
      } else if (fromDate) {
        if (!(logDate >= fromDate)) return false;
      } else if (toDate) {
        if (!(logDate <= toDate)) return false;
      }
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const titleMatch = log.title && log.title.toLowerCase().includes(query);
      const notesMatch = log.notes && log.notes.toLowerCase().includes(query);
      
      if (!titleMatch && !notesMatch) return false;
    }
    
    return true;
  });

  // Show error states if API calls fail
  if (healthIssuesError) {
    return (
      <div className="p-6">
        <div className="text-center p-4 text-red-600">
          <p>Error loading health issues. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (isLoadingHealthIssues) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center p-8">Loading health issues...</div>
      </div>
    );
  }

  return (
    <div>
      {currentPage === 'LOGBOOK' && (
        <div>
          <h1 className="text-2xl font-bold mb-4">Logbook</h1>
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <div className="flex flex-wrap justify-between items-center w-full">
              <div className="flex flex-wrap items-center gap-2">
                <select 
                  className="border rounded px-3 py-2 bg-white"
                  value={selectedHealthIssue}
                  onChange={handleHealthIssueChange}
                >
                  <option value="all">All Health Issues</option>
                  {healthIssues?.map(issue => (
                    <option key={issue.id} value={issue.id}>
                      {issue.title}
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  className="border rounded px-3 py-2 bg-white"
                  value={dateRange.from}
                  onChange={handleDateChange('from')}
                  placeholder="From Date"
                />
                <input
                  type="date"
                  className="border rounded px-3 py-2 bg-white"
                  value={dateRange.to}
                  onChange={handleDateChange('to')}
                  placeholder="To Date"
                />
              </div>
              
              {/* Search bar with icon */}
              <div className="relative mt-2 sm:mt-0">
                <svg
                  className="w-5 h-5 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4-4m0 0A7 7 0 119.5 9.5a7 7 0 017 7z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search logs..."
                  className="border rounded pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>

          <button
            className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 fixed bottom-6 right-6 flex items-center justify-center"
            onClick={() => dispatch(setCurrentPage('ADD_ENTRY'))}
          >
            <FaPlus className="text-xl" />
          </button>

          <div className="mt-4">
            {isLoadingLogs ? (
              <div className="text-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p>Loading logs...</p>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center p-4 text-gray-500">
                <p>No logs available {selectedHealthIssue !== 'all' ? 'for this health issue' : ''}.</p>
                <p className="mt-2">Click on "+ Add Entry" to create one.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{log.title}</h3>
                        <p className="text-gray-600 mt-1">{log.notes}</p>
                        <div className="mt-2 space-y-1 text-sm text-gray-500">
                          {log.vital_signs && typeof log.vital_signs === 'object' && 
                            Object.entries(log.vital_signs).map(([key, data]) => {
                              if (data && typeof data === 'object' && 'value' in data && 'unit' in data) {
                                return <p key={key}>{key}: {data.value} {data.unit}</p>;
                              }
                              return null;
                            })}
                          <p>Recorded: {format(new Date(log.created_at), 'MMM d, yyyy h:mm a')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {currentPage === 'ADD_ENTRY' && (
        <VitalsModal 
          healthIssues={healthIssues}
          selectedHealthIssue={selectedHealthIssue}
          onClose={() => dispatch(setCurrentPage('LOGBOOK'))}
        />
      )}
    </div>
  );
};

export default Logbook;