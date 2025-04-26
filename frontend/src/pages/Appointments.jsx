import React, {useContext, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MainLayout from '../layouts/MainLayout';
import { AuthContext } from '../context/authContextDefinition';
import AppointmentHeader from '../components/Appointments/AppointmentHeader';
import AppointmentFilters from '../components/Appointments/AppointmentFilters';
import AppointmentContent from '../components/Appointments/AppointmentContent';
import useSentryTracking from '../hooks/useSentryTracking';
import { withSentryErrorBoundary } from '../components/common/withSentryErrorBoundary';
import { setFilter } from '../store/slices/appointmentSlice';

const Appointments = () => {
  const { user } = useContext(AuthContext);
  const { appointments, filter: appointmentFilter, loading: isLoading } = useSelector(state => state.appointments);
  const dispatch = useDispatch();
  
  // Initialize Sentry tracking
  const sentryTracking = useSentryTracking('Appointments', {
    metadata: {
      userId: user?.id,
      userName: user?.name
    }
  });

  const currentDateTime = '2025-02-16 11:09:10';
  
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
    
    dispatch(setFilter(newFilter));
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6">
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
      </div>
    </MainLayout>
  );
};

export default withSentryErrorBoundary(Appointments);