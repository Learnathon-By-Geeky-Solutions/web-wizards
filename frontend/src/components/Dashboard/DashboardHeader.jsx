import React from 'react';
import PropTypes from 'prop-types';
import UserProfile from '../Navbar/UserProfile';
import { useMediaQuery } from 'react-responsive';

const DashboardHeader = ({ user }) => {
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 18) return 'Afternoon';
    return 'Evening';
  };
  
  // Use media query to detect screen size
  const isLargeScreen = useMediaQuery({ query: '(min-width: 1024px)' });
  const isMediumScreen = useMediaQuery({ query: '(min-width: 768px) and (max-width: 1023px)' });

  // Select appropriate heading tag based on screen size
  const HeadingTag = isLargeScreen ? 'h1' : isMediumScreen ? 'h2' : 'h3';
  
  return (
    <div className="flex justify-between items-center mb-6">
      <HeadingTag className={`font-bold text-gray-800 ${isLargeScreen ? 'text-2xl' : isMediumScreen ? 'text-xl' : 'text-lg'}`}>
        Good {getTimeOfDay()}, {user?.name || 'User'}
      </HeadingTag>
      
      {/* Only show UserProfile on large screens (when sidebar is expanded) */}
      {isLargeScreen && <UserProfile />}
    </div>
  );
};

DashboardHeader.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
  }),
};

export default DashboardHeader;