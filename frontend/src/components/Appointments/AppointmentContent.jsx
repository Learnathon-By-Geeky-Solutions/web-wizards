import React from 'react';
import PropTypes from 'prop-types';
import EmptyState from '../common/EmptyState';
import AppointmentItem from './AppointmentItem';

const AppointmentContent = ({ appointments, user, appointmentFilter }) => {
  // Function to handle appointment scheduling
  const handleScheduleAppointment = () => {
    console.log('Schedule appointment clicked');
    // Add your appointment scheduling logic here
  };

  return (
    <section className="bg-white rounded-lg shadow-lg p-6">
      {appointments.length === 0 ? (
        <EmptyState 
          message={appointmentFilter === 'all' 
            ? `${user?.name || 'You'} don't have any appointments scheduled yet.` 
            : `No ${appointmentFilter.toLowerCase()} appointments found.`}
          icon="calendar"
          title={`No appointments for ${user?.name || 'you'}`}
          actionText="Schedule Appointment"
          onAction={handleScheduleAppointment}
          bgColor="bg-gray-100"
          iconColor="text-teal-500"
        />
      ) : (
        <div className="divide-y divide-gray-200">
          {appointments.map(appointment => (
            <AppointmentItem 
              key={appointment.id} 
              appointment={appointment} 
            />
          ))}
        </div>
      )}
    </section>
  );
};

AppointmentContent.propTypes = {
  appointments: PropTypes.array.isRequired,
  user: PropTypes.object,
  appointmentFilter: PropTypes.string
};

export default AppointmentContent;