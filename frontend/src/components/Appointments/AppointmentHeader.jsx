import React from 'react';
import PropTypes from 'prop-types';
import UserProfile from '../Navbar/UserProfile';

const AppointmentHeader = ({ currentDateTime }) => {
  return (
    <header className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Appointments</h2>
        <output className="text-sm text-gray-600">
          {currentDateTime}
        </output>
      </div>
      <UserProfile />
    </header>
  );
};
AppointmentHeader.propTypes = {
  currentDateTime: PropTypes.string.isRequired,
};

export default AppointmentHeader;