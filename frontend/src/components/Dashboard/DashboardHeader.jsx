import React from 'react';
import UserProfile from '../Navbar/UserProfile';

const DashboardHeader = ({ user }) => {
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 18) return 'Afternoon';
    return 'Evening';
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <p className="text-gray-600">
        Good {getTimeOfDay()}, {user?.name || 'User'}
      </p>
      <UserProfile />
    </div>
  );
};

export default DashboardHeader;