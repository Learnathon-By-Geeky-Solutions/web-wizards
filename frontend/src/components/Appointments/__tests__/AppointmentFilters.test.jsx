import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AppointmentFilters from '../AppointmentFilters';

describe('AppointmentFilters Component', () => {
  it('renders the filter dropdown and handles filter changes', () => {
    const mockSetAppointmentFilter = jest.fn();
    render(
      <AppointmentFilters 
        appointmentFilter="all" 
        setAppointmentFilter={mockSetAppointmentFilter} 
      />
    );

    const dropdown = screen.getByRole('combobox');
    expect(dropdown).toBeInTheDocument();
    expect(dropdown.value).toBe('all');

    fireEvent.change(dropdown, { target: { value: 'completed' } });
    expect(mockSetAppointmentFilter).toHaveBeenCalledWith('completed');
  });
});