import React from 'react';
import PropTypes from 'prop-types';
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
      <h1 className="text-2xl font-bold text-gray-800">
        Good {getTimeOfDay()}, {user?.name || 'User'}
      </h1>
      <UserProfile />
    </div>
  );
};

DashboardHeader.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
  }),
};

export default DashboardHeader;