import React from 'react';
import PropTypes from 'prop-types';

const MedicationFilters = ({ 
  statusFilter, 
  setStatusFilter, 
  healthIssueFilter, 
  setHealthIssueFilter, 
  searchTerm, 
  setSearchTerm 
}) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        {/* Status filters */}
        <div className="flex items-center space-x-2">
          {['Active', 'Inactive', 'All'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-full ${
                statusFilter === status
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Health issue dropdown */}
        <select
          value={healthIssueFilter}
          onChange={(e) => setHealthIssueFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1 text-gray-700"
        >
          <option>All Health Issues</option>
          <option>Current Health Issues</option>
          <option>Past Health Issues</option>
        </select>

        {/* Search bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded pl-3 pr-3 py-1 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

MedicationFilters.propTypes = {
  statusFilter: PropTypes.string.isRequired,
  setStatusFilter: PropTypes.func.isRequired,
  healthIssueFilter: PropTypes.string.isRequired,
  setHealthIssueFilter: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
};

export default MedicationFilters;