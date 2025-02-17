import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import Sidebar from '../Sidebar';

const Medication = () => {
  const { user } = useContext(AuthContext);
  const [fullName] = useState('Faysal Ahammed');
  const [isLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [appointmentFilter, setAppointmentFilter] = useState('all');

  // Display the first letter of user's name
  const getFirstLetter = (name) => name?.[0].toUpperCase();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 ml-64 p-6">
        {/* Header Section with Title and Profile */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Medication</h2>
          
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

        {/* Filter Section */}
        <div className="flex justify-end mb-6">
          <select 
            className="border rounded px-3 py-2 bg-white text-gray-700 w-48"
            value={appointmentFilter}
            onChange={(e) => setAppointmentFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="completed">Completed Appointments</option>
            <option value="pending">Pending Appointments</option>
          </select>
        </div>

        {/* Appointments Content */}
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">No appointments to display</p>
        </div>
      </div>
    </div>
  );
};

export default Medication;