import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import Sidebar from '../Sidebar';
import { ChatBubbleOvalLeftIcon } from '@heroicons/react/24/outline';

const Chat = () => {
  const { user, logout } = useContext(AuthContext);
  const [fullName] = useState('Faysal Ahammed');
  const [isLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleProfileInfoClick = () => {
    alert(`Profile Info\nName: ${user?.name}\nEmail: ${user?.email}`);
    setIsDropdownOpen(false);
  };

  const handleLogoutClick = () => {
    logout();
    setIsDropdownOpen(false);
  };

  // Display the first letter of user's name
  const getFirstLetter = (name) => name?.[0].toUpperCase();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64 p-6">
        {/* Header with Profile Dropdown */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Recent Chat Messages</h2>
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
                  onClick={handleProfileInfoClick}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile Info
                </button>
                <button
                  onClick={handleLogoutClick}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Chat Content Area */}
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">No messages to display</p>
        </div>
      </div>
    </div>
  );
};

export default Chat;