import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useGetHealthIssuesQuery } from '../../../store/api/healthIssuesApi';
import SymptomsList from './SymptomsList';

const SymptomsHome = ({ openLogSymptoms, initialHealthIssue }) => {
  const { data: healthIssues = [], isLoading } = useGetHealthIssuesQuery();
  const [selectedHealthIssue, setSelectedHealthIssue] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Set the selected health issue when the initialHealthIssue prop changes
  useEffect(() => {
    if (initialHealthIssue) {
      setSelectedHealthIssue(initialHealthIssue);
    }
  }, [initialHealthIssue]);

  const handleHealthIssueChange = (e) => {
    setSelectedHealthIssue(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="relative">
      {/* Header + Filters */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Symptoms History</h1>
        <div className="flex items-center space-x-4">
          <select 
            className="border rounded px-3 py-2"
            value={selectedHealthIssue}
            onChange={handleHealthIssueChange}
          >
            <option value="all">All Health Issues</option>
            {healthIssues.map(issue => (
              <option key={issue.id} value={issue.id}>
                {issue.title}
              </option>
            ))}
          </select>
          {/* Search bar with icon */}
          <div className="relative">
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
              placeholder="Search symptoms..."
              className="border rounded pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      {/* Loading State for Health Issues */}
      {isLoading ? (
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p>Loading health issues...</p>
        </div>
      ) : (
        <>
          {/* Symptoms List */}
          <SymptomsList 
            healthIssueId={selectedHealthIssue === 'all' ? null : selectedHealthIssue}
            searchQuery={searchQuery}
          />

          {/* Floating Plus Button */}
          <button
            onClick={() => openLogSymptoms(selectedHealthIssue)}
            className="bg-teal-500 text-white w-12 h-12 rounded-full fixed bottom-6 right-6
              flex items-center justify-center text-2xl hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            aria-label="Log new symptom"
          >
            +
          </button>
        </>
      )}
    </div>
  );
};

SymptomsHome.propTypes = {
  openLogSymptoms: PropTypes.func.isRequired,
  initialHealthIssue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

SymptomsHome.defaultProps = {
  initialHealthIssue: null,
};

export default SymptomsHome;