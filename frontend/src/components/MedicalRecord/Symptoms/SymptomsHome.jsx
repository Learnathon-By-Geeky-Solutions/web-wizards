import React from 'react';
import PropTypes from 'prop-types';

const SymptomsHome = ({ openLogSymptoms }) => {
  return (
    <div className="relative">
      {/* Header + Filters */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Symptoms History</h1>
        <div className="flex items-center space-x-4">
          <select className="border rounded px-3 py-2">
            <option>All Health Issues</option>
            <option>Issue 1</option>
            <option>Issue 2</option>
          </select>
          {/* Search bar with icon */}
          <div className="relative">
            <svg
              className="w-5 h-5 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2"
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
              placeholder="Search..."
              className="border rounded pl-8 pr-3 py-2 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Empty State Illustration */}
      <div className="flex flex-col items-center justify-center mt-16 text-center">
        {/* Replace with your own illustration/icon if desired */}
        <svg
          className="w-12 h-12 text-teal-400 mb-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M12 4v16M4 12h16" />
        </svg>
        <p className="text-gray-500 text-lg">
          This user has not logged any symptoms yet.
        </p>
      </div>

      {/* Floating Plus Button */}
      <button
        onClick={openLogSymptoms}
        className="bg-teal-500 text-white w-12 h-12 rounded-full fixed bottom-6 right-6
          flex items-center justify-center text-2xl hover:bg-teal-600"
      >
        +
      </button>
    </div>
  );
};

SymptomsHome.propTypes = {
  openLogSymptoms: PropTypes.func.isRequired,
};

export default SymptomsHome;