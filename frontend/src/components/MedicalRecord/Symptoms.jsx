import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import {
  Squares2X2Icon,
  ClipboardDocumentIcon,
  HeartIcon,
  UserGroupIcon,
  ChatBubbleOvalLeftIcon,
  CalendarIcon,
  Cog6ToothIcon,
  BookOpenIcon,
  ChartBarIcon,
  DocumentIcon,
  BeakerIcon,
} from '@heroicons/react/24/outline';

const Symptoms = () => {
  const { user, logout } = useContext(AuthContext);

  // Basic states
  const [fullName, setFullName] = useState('Faysal Ahammed');
  const [isLoading, setIsLoading] = useState(false);

  // Page navigation for Symptoms
  const [currentPage, setCurrentPage] = useState('SYMPTOMS_HOME');

  // Sidebar & Top Navigation items
  const sidebarItems = [
    { name: 'Dashboard', icon: Squares2X2Icon },
    { name: 'Medical record', icon: ClipboardDocumentIcon },
    { name: 'Health Issues', icon: HeartIcon },
    { name: 'Medications', icon: ClipboardDocumentIcon },
    { name: 'Clinicians', icon: UserGroupIcon },
    { name: 'Chat', icon: ChatBubbleOvalLeftIcon },
    { name: 'Appointments', icon: CalendarIcon },
    { name: 'Settings', icon: Cog6ToothIcon },
  ];

  const topNavItems = [
    { name: 'Dashboard', icon: Squares2X2Icon },
    { name: 'Logbook', icon: BookOpenIcon },
    { name: 'Symptoms', icon: HeartIcon },
    { name: 'Charts', icon: ChartBarIcon },
    { name: 'Documents', icon: DocumentIcon },
    { name: 'Lab Results', icon: BeakerIcon },
  ];

  // Handlers to switch between pages
  const openLogSymptoms = () => setCurrentPage('LOG_SYMPTOMS');
  const closeLogSymptoms = () => setCurrentPage('SYMPTOMS_HOME');

  // Loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-teal-900 text-white p-4 space-y-4">
        <h1 className="text-2xl font-bold">Amarhealth</h1>
        <nav>
          {sidebarItems.map((item) => (
            <button
              key={item.name}
              className="flex items-center p-3 space-x-3 w-full rounded-lg hover:bg-teal-700"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Top Navigation */}
        <div className="flex justify-between items-center bg-white p-3 shadow-md rounded-lg">
          <div className="flex space-x-6">
            {topNavItems.map((item) => (
              <button
                key={item.name}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-3">
            <span className="font-semibold">{fullName}</span>
            <img
              src="/user-avatar.png"
              alt="User"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </div>

        {/* Symptoms Pages */}
        <div className="mt-6 relative">
          {/* Page 1: Symptoms Home */}
          {currentPage === 'SYMPTOMS_HOME' && (
            <div>
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
              <div className="flex flex-col items-center justify-center mt-16">
                <div className="w-32 h-32 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                  {/* Replace with your own illustration/icon if desired */}
                  <svg
                    className="w-12 h-12 text-teal-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 4v16M4 12h16" />
                  </svg>
                </div>
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
          )}

          {/* Page 2: Log Symptoms (Modal) */}
          {currentPage === 'LOG_SYMPTOMS' && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative">
                <h2 className="text-2xl font-bold mb-4">Log symptoms</h2>

                {/* Choose Symptom */}
                <div className="mb-4">
                  <label className="block font-medium mb-1">Choose Symptom</label>
                  <div className="flex items-center border rounded px-3 py-2">
                    <input
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
                  <label className="block font-medium mb-1">Selected Symptoms</label>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="form-checkbox" />
                    <span>No Symptoms</span>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="flex space-x-4 mb-4">
                  <div>
                    <label className="block font-medium mb-1">Date</label>
                    <input
                      type="date"
                      defaultValue="2025-02-15"
                      className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Time</label>
                    <input
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Symptoms;