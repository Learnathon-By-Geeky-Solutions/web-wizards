import React from 'react';
import { CalendarIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

const EmptyState = ({ currentUser, appointmentFilter }) => {
  const handleScheduleAppointment = () => {
    // Implement appointment scheduling functionality
    console.log('Schedule appointment clicked');
  };
  
  return (
    <output className="block text-center py-12">
      <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">
        No appointments for {currentUser || 'you'}
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        {appointmentFilter === 'all' 
          ? "You don't have any appointments scheduled yet."
          : `No ${appointmentFilter.toLowerCase()} appointments found.`}
      </p>
      <div className="mt-6">
        <button
          type="button"
          onClick={handleScheduleAppointment}
          className="inline-flex items-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
        >
          <CalendarIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          Schedule Appointment
        </button>
      </div>
    </output>
  );
};

export default EmptyState;