import React from 'react';
import PropTypes from 'prop-types';
import EmptyState from './EmptyState';
import AppointmentItem from './AppointmentItem';

const AppointmentContent = ({ appointments, user, appointmentFilter }) => {
  return (
    <section className="bg-white rounded-lg shadow-lg p-6">
      {appointments.length === 0 ? (
        <EmptyState 
          currentUser={user?.name}
          appointmentFilter={appointmentFilter}
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