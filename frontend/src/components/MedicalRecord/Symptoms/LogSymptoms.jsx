import React from 'react';
import PropTypes from 'prop-types';

const LogSymptoms = ({ closeLogSymptoms }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative">
        <h2 className="text-2xl font-bold mb-4">Log symptoms</h2>

        {/* Choose Symptom */}
        <div className="mb-4">
          <label htmlFor="symptom-search" className="block font-medium mb-1">Choose Symptom</label>
          <div className="flex items-center border rounded px-3 py-2">
            <input
              id="symptom-search"
              type="text"
              placeholder="Search For Symptom"
              className="flex-1 focus:outline-none"
            />
            <svg
              className="w-5 h-5 text-gray-400"
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
          </div>
        </div>

        {/* Selected Symptoms */}
        <div className="mb-4">
          <label htmlFor="no-symptoms" className="block font-medium mb-1">Selected Symptoms</label>
          <div className="flex items-center space-x-2">
            <input id="no-symptoms" type="checkbox" className="form-checkbox" />
            <span>No Symptoms</span>
          </div>
        </div>

        {/* Date & Time */}
        <div className="flex space-x-4 mb-4">
          <div>
            <label htmlFor="date" className="block font-medium mb-1">Date</label>
            <input
              id="date"
              type="date"
              defaultValue="2025-02-15"
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label htmlFor="time" className="block font-medium mb-1">Time</label>
            <input
              id="time"
              type="time"
              defaultValue="12:08"
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={closeLogSymptoms}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            Close
          </button>
          <button className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

LogSymptoms.propTypes = {
  closeLogSymptoms: PropTypes.func.isRequired,
};

export default LogSymptoms;