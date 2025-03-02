import React, { useState } from 'react';

const MedicationHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [fullName] = useState('Faysal Ahammed');
  
  // Display the first letter of user's name
  const getFirstLetter = (name) => name?.[0].toUpperCase();
  
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">Medication Plans</h2>
      
      {/* User Profile Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-2 p-2 rounded-full hover:bg-teal-700"
        >
          <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white">
            {getFirstLetter(fullName)}
          </div>
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Profile Info
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationHeader;