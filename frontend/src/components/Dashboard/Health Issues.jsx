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
} from '@heroicons/react/24/outline';

const HealthIssues = () => {
  const { user, logout } = useContext(AuthContext);

  // Basic states
  const [fullName, setFullName] = useState('Faysal Ahammed');
  const [isLoading, setIsLoading] = useState(false);

  // Page navigation for Health Issues
  const [currentPage, setCurrentPage] = useState('HEALTH_ISSUES_HOME');

  // Sidebar items
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

  // Handlers to switch between pages
  const openLogHealthIssues = () => setCurrentPage('LOG_HEALTH_ISSUES');
  const closeLogHealthIssues = () => setCurrentPage('HEALTH_ISSUES_HOME');

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
        {/* Health Issues Pages */}
        <div className="mt-6 relative">
          {/* Page 1: Health Issues Home */}
          {currentPage === 'HEALTH_ISSUES_HOME' && (
            <div>
              {/* Header + Filters */}
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Health Issues</h1>
                <div className="flex items-center space-x-4">
                  <select className="border rounded px-3 py-2">
                    <option>All Health Issues</option>
                    <option>Current Health Issues</option>
                    <option>Past Health Issues</option>
                  </select>
                  {/* Search bar with icon */}
                  <div className="relative">
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
                  <svg className="w-12 h-12 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 4v16M4 12h16" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">This user has not logged any health issues yet.</p>
              </div>

              {/* Floating Plus Button */}
              <button
                onClick={openLogHealthIssues}
                className="bg-teal-500 text-white w-12 h-12 rounded-full fixed bottom-6 right-6 flex items-center justify-center text-2xl hover:bg-teal-600"
              >
                +
              </button>
            </div>
          )}

          {/* Page 2: Log Health Issues (Modal) */}
          {currentPage === 'LOG_HEALTH_ISSUES' && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative">
                <h2 className="text-2xl font-bold mb-4">Add Health Issue</h2>

                {/* Input Fields */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date*</label>
                      <input type="date" className="w-full p-2 border rounded-md" defaultValue="2025-02-15" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Time*</label>
                      <input type="time" className="w-full p-2 border rounded-md" defaultValue="17:21" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Health Issue Title</label>
                    <input type="text" placeholder="Enter Health Issue" className="w-full p-2 border rounded-md" />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2 mt-4">
                  <button onClick={closeLogHealthIssues} className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">
                    Close
                  </button>
                  <button className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600">Save</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthIssues;
