import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthContext } from '../../context/authContext';
import Appointments from '../Appointments';

describe('Appointments Page', () => {
  const mockUser = { id: 'user-001', name: 'John Doe' };

  it('renders the Appointments page with default data', () => {
    render(
      <AuthContext.Provider value={{ user: mockUser }}>
        <Appointments />
      </AuthContext.Provider>
    );

    expect(screen.getByText('Appointments')).toBeInTheDocument();
    expect(screen.getByText('Annual Physical Checkup')).toBeInTheDocument();
    expect(screen.getByText('Dental Cleaning')).toBeInTheDocument();
    expect(screen.getByText('Follow-up Consultation')).toBeInTheDocument();
  });

  it('filters appointments based on status', () => {
    render(
      <AuthContext.Provider value={{ user: mockUser }}>
        <Appointments />
      </AuthContext.Provider>
    );

    const filterDropdown = screen.getByRole('combobox');
    fireEvent.change(filterDropdown, { target: { value: 'completed' } });

    expect(screen.getByText('Follow-up Consultation')).toBeInTheDocument();
    expect(screen.queryByText('Annual Physical Checkup')).not.toBeInTheDocument();
    expect(screen.queryByText('Dental Cleaning')).not.toBeInTheDocument();
  });
});