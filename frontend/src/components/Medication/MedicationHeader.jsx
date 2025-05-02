import React from 'react';
import PropTypes from 'prop-types';
import UserProfile from '../Navbar/UserProfile';
import { useMediaQuery } from 'react-responsive';

const MedicationHeader = ({ fullName = '' }) => {
  // Use media query to detect large screens (consistent with DashboardHeader)
  const isLargeScreen = useMediaQuery({ query: '(min-width: 1024px)' });
  
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">Medication Plans</h2>
      
      {/* Only show UserProfile on large screens (when sidebar is likely expanded) */}
      {isLargeScreen && <UserProfile />}
    </div>
  );
};

MedicationHeader.propTypes = {
  fullName: PropTypes.string,
};

export default MedicationHeader;