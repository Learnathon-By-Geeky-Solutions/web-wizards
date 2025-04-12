import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaSearch, FaTimes } from 'react-icons/fa';

const HealthIssuesHeader = ({ onFilterChange, onSearch, activeFilter = 'all' }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterChange = (e) => {
    onFilterChange(e.target.value);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Trigger search as user types
    onSearch(value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  // These are no longer needed for real-time search but keeping them for fallback
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      onSearch(searchQuery);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <h1 className="text-2xl font-bold">Health Issues</h1>
      <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
        <select 
          className="border rounded px-3 py-2 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-teal-500"
          onChange={handleFilterChange}
          value={activeFilter}
        >
          <option value="all">All Health Issues</option>
          <option value="active">Current Health Issues</option>
          <option value="resolved">Past Health Issues</option>
          <option value="monitoring">Monitoring</option>
        </select>
        
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search health issues..."
            className="border rounded pl-9 pr-9 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <FaTimes />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

HealthIssuesHeader.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  activeFilter: PropTypes.string
};

export default HealthIssuesHeader;