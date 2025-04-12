import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { 
  useGetHealthIssuesQuery, 
  useGetHealthIssueLogEntriesQuery 
} from '../../../store/api/healthIssuesApi';
import { setCurrentPage } from '../../../store/slices/logbookSlice';
import { FaPlus } from 'react-icons/fa';
import VitalsModal from './VitalsModal';

const LogbookPage = () => {
  const dispatch = useDispatch();
  const { currentPage } = useSelector(state => state.logbook);
  const [selectedHealthIssue, setSelectedHealthIssue] = useState('all');
  const [dateRange, setDateRange] = useState({
    from: '',
    to: ''
  });

  // Fetch health issues - this will be cached by RTK Query
  const { data: healthIssues, isLoading: isLoadingHealthIssues } = useGetHealthIssuesQuery();

  // Fetch log entries for selected health issue
  const { data: logEntries, isLoading: isLoadingLogs } = useGetHealthIssueLogEntriesQuery(
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

  const filteredLogs = (logEntries || []).filter(log => {
    if (!dateRange.from && !dateRange.to) return true;
    
    const logDate = new Date(log.created_at);
    const fromDate = dateRange.from ? new Date(dateRange.from) : null;
    const toDate = dateRange.to ? new Date(dateRange.to) : null;

    if (fromDate && toDate) {
      return logDate >= fromDate && logDate <= toDate;
    }
    if (fromDate) {
      return logDate >= fromDate;
    }
    if (toDate) {
      return logDate <= toDate;
    }
    return true;
  });

  if (isLoadingHealthIssues) {
    return <div className="flex justify-center items-center p-8">Loading health issues...</div>;
  }

  return (
    <div className="mt-6">
      {currentPage === 'LOGBOOK' && (
        <div>
          <h1 className="text-2xl font-bold mb-4">Logbook</h1>
          <div className="flex flex-wrap items-center gap-2 mb-6">
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

          <button
            className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 fixed bottom-6 right-6 flex items-center justify-center"
            onClick={() => dispatch(setCurrentPage('ADD_ENTRY'))}
          >
            <FaPlus className="text-xl" />
          </button>

          <div className="mt-4">
            {isLoadingLogs ? (
              <div className="text-center p-4">Loading logs...</div>
            ) : filteredLogs.length === 0 ? (
              <p>No logs available. Click on "+ Add Entry" to create one.</p>
            ) : (
              <div className="space-y-4">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{log.title}</h3>
                        <p className="text-gray-600 mt-1">{log.notes}</p>                        <div className="mt-2 space-y-1 text-sm text-gray-500">
                          {log.vital_signs && Object.entries(log.vital_signs).map(([key, { value, unit }]) => (
                            <p key={key}>{key}: {value} {unit}</p>
                          ))}
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

export default LogbookPage;
