import React from 'react';
import PropTypes from 'prop-types';
import { FaSearch, FaStar } from 'react-icons/fa';

const SearchFilters = ({ filters, onFilterChange, specializations, activeTab }) => {
  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    onFilterChange(name, checked);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="space-y-4">
        {/* Search term */}
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="searchTerm"
            value={filters.searchTerm}
            onChange={handleInputChange}
            placeholder={activeTab === 'clinicians' 
              ? "Search by clinician name or specialization..." 
              : "Search by center name or services..."}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        
        {/* Top filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* City filter */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <select
              id="city"
              name="city"
              value={filters.city}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="">Any city</option>
              <option value="New York">New York</option>
              <option value="Los Angeles">Los Angeles</option>
              <option value="Chicago">Chicago</option>
              <option value="Houston">Houston</option>
              <option value="Phoenix">Phoenix</option>
              <option value="Philadelphia">Philadelphia</option>
              <option value="San Antonio">San Antonio</option>
              <option value="San Diego">San Diego</option>
              <option value="Dallas">Dallas</option>
              <option value="San Jose">San Jose</option>
            </select>
          </div>
          
          {/* Show specialization filter only for clinicians */}
          {activeTab === 'clinicians' && (
            <div>
              <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                Specialization
              </label>
              <select
                id="specialization"
                name="specialization"
                value={filters.specialization}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="">Any specialization</option>
                {specializations.map(spec => (
                  <option key={spec.id} value={spec.id.toString()}>
                    {spec.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {/* Rating filter */}
          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Rating
            </label>
            <select
              id="rating"
              name="rating"
              value={filters.rating}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="">Any rating</option>
              <option value="5">
                5 stars <FaStar className="inline text-yellow-400 ml-1" />
              </option>
              <option value="4">
                4+ stars <FaStar className="inline text-yellow-400 ml-1" />
              </option>
              <option value="3">
                3+ stars <FaStar className="inline text-yellow-400 ml-1" />
              </option>
              <option value="2">
                2+ stars <FaStar className="inline text-yellow-400 ml-1" />
              </option>
            </select>
          </div>
        </div>
        
        {/* Checkbox filters */}
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {activeTab === 'clinicians' ? (
            <>
              {/* Clinician-specific filters */}
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="availableOnline"
                  checked={filters.availableOnline}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <span className="ml-2 text-gray-700">Available online</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="acceptingPatients"
                  checked={filters.acceptingPatients}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <span className="ml-2 text-gray-700">Accepting new patients</span>
              </label>
            </>
          ) : (
            <>
              {/* Diagnostic center-specific filters */}
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="is24Hours"
                  checked={filters.is24Hours}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <span className="ml-2 text-gray-700">Open 24 hours</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="hasHomeCollection"
                  checked={filters.hasHomeCollection}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <span className="ml-2 text-gray-700">Home collection available</span>
              </label>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

SearchFilters.propTypes = {
  filters: PropTypes.shape({
    searchTerm: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    specialization: PropTypes.string.isRequired,
    rating: PropTypes.string.isRequired,
    availableOnline: PropTypes.bool.isRequired,
    acceptingPatients: PropTypes.bool.isRequired,
    is24Hours: PropTypes.bool.isRequired,
    hasHomeCollection: PropTypes.bool.isRequired,
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  specializations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeTab: PropTypes.string.isRequired,
};

export default SearchFilters;