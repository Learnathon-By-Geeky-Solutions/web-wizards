import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/authContext';
import Sidebar from '../components/Sidebar';
import AppointmentHeader from '../components/Appointments/AppointmentHeader';
import AppointmentFilters from '../components/Appointments/AppointmentFilters';
import AppointmentContent from '../components/Appointments/AppointmentContent';
import useSentryTracking from '../hooks/useSentryTracking';
import { withSentryErrorBoundary } from '../components/common/withSentryErrorBoundary';

const Appointments = () => {
  const { user } = useContext(AuthContext);
  
  // Initialize Sentry tracking
  const sentryTracking = useSentryTracking('Appointments', {
    metadata: {
      userId: user?.id,
      userName: user?.name
    }
  });
  
  // States
  const [appointmentFilter, setAppointmentFilter] = useState('all');
  const [isLoading] = useState(false);

  const currentDateTime = '2025-02-16 11:09:10';
  
  // Dummy appointment data
  const [appointments, setAppointments] = useState([
    {
      id: 'apt-001',
      title: 'Annual Physical Checkup',
      date: '2025-03-15',
      time: '09:30 AM',
      doctorName: 'Sarah Johnson',
      status: 'pending',
      location: 'Central Hospital, Room 305',
      notes: 'Please bring your medical records and arrive 15 minutes early'
    },
    {
      id: 'apt-002',
      title: 'Dental Cleaning',
      date: '2025-03-20',
      time: '14:00 PM',
      doctorName: 'Michael Chen',
      status: 'pending',
      location: 'City Dental Clinic',
      notes: 'Regular 6-month cleaning'
    },
    {
      id: 'apt-003',
      title: 'Follow-up Consultation',
      date: '2025-02-05',
      time: '11:15 AM',
      doctorName: 'Emily Williams',
      status: 'completed',
      location: 'Community Healthcare Center',
      notes: 'Blood pressure check and medication review'
    }
  ]);

  // Function to filter appointments based on selected filter
  const filteredAppointments = appointments.filter(appointment => {
    if (appointmentFilter === 'all') return true;
    return appointment.status === appointmentFilter;
  });
  
  // Track filter changes
  const handleFilterChange = (newFilter) => {
    sentryTracking.trackAction('Changed appointment filter', { 
      previousFilter: appointmentFilter,
      newFilter 
    });
    
    setAppointmentFilter(newFilter);
  };

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
          setAppointmentFilter={handleFilterChange} 
        />
        
        <AppointmentContent 
          appointments={filteredAppointments} 
          user={user}
          appointmentFilter={appointmentFilter}
        />
      </main>
    </div>
  );
};

export default withSentryErrorBoundary(Appointments);