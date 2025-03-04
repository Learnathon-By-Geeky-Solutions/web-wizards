import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/authContext';
import Sidebar from '../components/Sidebar';
import AppointmentHeader from '../components/Appointments/AppointmentHeader';
import AppointmentFilters from '../components/Appointments/AppointmentFilters';
import AppointmentContent from '../components/Appointments/AppointmentContent';
const Appointments = () => {
  const { user } = useContext(AuthContext);
  
  // States
  const [appointmentFilter, setAppointmentFilter] = useState('all');
  const [isLoading] = useState(false);

  const currentDateTime = '2025-02-16 11:09:10';
  const appointments = [];

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 ml-64 p-6">
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 ml-64 p-6">
        <AppointmentHeader currentDateTime={currentDateTime} />
        
        <AppointmentFilters 
          appointmentFilter={appointmentFilter} 
          setAppointmentFilter={setAppointmentFilter} 
        />
        
        <AppointmentContent 
          appointments={appointments} 
          user={user}
          appointmentFilter={appointmentFilter}
        />
      </main>
    </div>
  );
};

export default Appointments;