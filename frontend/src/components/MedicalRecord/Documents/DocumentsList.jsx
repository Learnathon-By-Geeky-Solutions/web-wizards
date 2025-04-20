import React from 'react';
import PropTypes from 'prop-types';

const DocumentsList = ({ setShowAddForm }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Documents</h1>
      </div>

      {/* Dropdowns for filtering */}
      <div className="flex gap-4 mb-6">
        <select className="border rounded px-3 py-2">
          <option>All Health Issues</option>
          <option>Cardiology</option>
        </select>
        <select className="border rounded px-3 py-2">
          <option>All Documents</option>
          <option>Epicrisis</option>
          <option>Prescription</option>
          <option>Laboratory results</option>
          <option>Medical report</option>
          <option>Referral</option>
          <option>Other</option>
        </select>
      </div>

      {/* Search Bar with icon on right */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search..."
          className="border rounded pr-10 pl-3 py-2 focus:outline-none w-full"
        />
        <svg
          className="w-6 h-6 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2"
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

      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <p className="text-gray-500">
          This user has not uploaded any documents yet.
        </p>
      </div>

      {/* Floating Plus Button */}
      <button
        onClick={() => setShowAddForm(true)}
        className="fixed right-6 bottom-6 p-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 shadow-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
  );
};

DocumentsList.propTypes = {
    setShowAddForm: PropTypes.func.isRequired,
};

export default DocumentsList;