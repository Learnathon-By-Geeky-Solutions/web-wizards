import React from 'react';
import { render, screen } from '@testing-library/react';
import AppointmentItem from '../AppointmentItem';

describe('AppointmentItem Component', () => {
  it('renders appointment details correctly', () => {
    const appointment = {
      title: 'Dental Cleaning',
      date: '2025-03-20',
      time: '14:00 PM',
      doctorName: 'Michael Chen',
      status: 'pending',
    };

    render(<AppointmentItem appointment={appointment} />);

    expect(screen.getByText('Dental Cleaning')).toBeInTheDocument();
    expect(screen.getByText('2025-03-20')).toBeInTheDocument();
    expect(screen.getByText('14:00 PM')).toBeInTheDocument();
    expect(screen.getByText('With Dr. Michael Chen')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();
  });
});