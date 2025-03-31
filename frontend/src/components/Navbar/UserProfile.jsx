import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
    setIsDropdownOpen(false);
  };

  if (!user) {
    return (
      <div className="flex items-center space-x-2 p-2">
        <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
        <div className="w-20 h-4 bg-gray-300 rounded animate-pulse"></div>
      </div>
    );
  }

  // The user profile data structure includes a nested user object with name
  const userName = user.user?.name || '';
  
  // Get first letter for fallback avatar
  const firstLetter = userName ? userName[0].toUpperCase() : '?';

  return (
    <div className="relative flex justify-end">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
      >
        {user.image ? (
          <img 
            src={user.image} 
            alt={userName || 'Profile'} 
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white">
            {firstLetter}
          </div>
        )}
        <span className="text-gray-700">{userName}</span>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-12 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
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