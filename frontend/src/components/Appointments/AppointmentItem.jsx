import React from 'react';

const AppointmentItem = ({ appointment }) => {
  // This is a placeholder for rendering individual appointments
  return (
    <div className="py-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            {appointment.title || 'Appointment'}
          </h3>
          <div className="mt-1 flex items-center text-sm text-gray-500">
            <span>{appointment.date}</span>
            <span className="mx-1">•</span>
            <span>{appointment.time}</span>
          </div>
          {appointment.doctorName && (
            <p className="mt-1 text-sm text-gray-500">
              With Dr. {appointment.doctorName}
            </p>
          )}
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${
          appointment.status === 'completed' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {appointment.status}
        </span>
      </div>
    </div>
  );
};

export default AppointmentItem;