import React from 'react';
import { render, screen } from '@testing-library/react';
import AppointmentHeader from '../AppointmentHeader';

describe('AppointmentHeader Component', () => {
  it('renders the header with the current date and time', () => {
    const currentDateTime = '2025-04-01 10:00:00';

    render(<AppointmentHeader currentDateTime={currentDateTime} />);

    expect(screen.getByText('Appointments')).toBeInTheDocument();
    expect(screen.getByText(currentDateTime)).toBeInTheDocument();
  });
});