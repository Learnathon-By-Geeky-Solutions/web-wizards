import React from 'react';
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

export default AppointmentHeader;