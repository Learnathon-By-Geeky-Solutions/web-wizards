import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/authContext';

const UserProfile = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const getFirstLetter = () => {
    return user?.name ? user.name[0].toUpperCase() : '?';
  };

  const handleProfileInfo = () => {
    if (user) {
      alert(`Profile Info\nName: ${user.name}\nEmail: ${user.email}\nUser Type: ${user.user_type}`);
    }
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  if (!user) {
    return null; // Or a loading spinner
  }

  return (
    <div className="relative flex justify-end mb-4">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
      >
        <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white">
          {getFirstLetter()}
        </div>
        <span className="text-gray-700">{user.name}</span>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-12 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
          <button
            onClick={handleProfileInfo}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Profile Info
          </button>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;