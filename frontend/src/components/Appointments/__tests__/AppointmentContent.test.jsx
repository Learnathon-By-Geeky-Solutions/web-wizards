import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AppointmentContent from '../AppointmentContent';

describe('AppointmentContent Component', () => {
  it('renders empty state when no appointments are present', () => {
    render(
      <AppointmentContent 
        appointments={[]} 
        user={{ name: 'John Doe' }} 
        appointmentFilter="all" 
      />
    );

    expect(screen.getByText("John Doe don't have any appointments scheduled yet.")).toBeInTheDocument();
  });

  it('renders appointments when provided', () => {
    const appointments = [
      {
        id: 'apt-001',
        title: 'Annual Physical Checkup',
        date: '2025-03-15',
        time: '09:30 AM',
        doctorName: 'Sarah Johnson',
        status: 'pending',
      },
    ];

    render(
      <AppointmentContent 
        appointments={appointments} 
        user={{ name: 'John Doe' }} 
        appointmentFilter="all" 
      />
    );

    expect(screen.getByText('Annual Physical Checkup')).toBeInTheDocument();
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
  });
});