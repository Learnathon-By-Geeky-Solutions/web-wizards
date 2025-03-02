import React from 'react';

const AppointmentFilters = ({ appointmentFilter, setAppointmentFilter }) => {
  return (
    <div className="flex justify-end items-center mb-6">
      <select 
        className="border rounded-lg px-4 py-2 bg-white text-gray-700 w-48 focus:outline-none focus:ring-2 focus:ring-teal-500"
        value={appointmentFilter}
        onChange={(e) => setAppointmentFilter(e.target.value)}
      >
        <option value="all">All Appointments</option>
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
      </select>
    </div>
  );
};

export default AppointmentFilters;