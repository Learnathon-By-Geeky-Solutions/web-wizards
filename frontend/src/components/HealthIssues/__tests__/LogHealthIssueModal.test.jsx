import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LogHealthIssueModal from '../LogHealthIssueModal';

describe('LogHealthIssueModal Component', () => {
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();

  it('renders the modal with default values', () => {
    render(<LogHealthIssueModal onClose={mockOnClose} onSuccess={mockOnSuccess} />);

    expect(screen.getByText('Log Health Issue')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Start Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
    expect(screen.getByLabelText('Severity')).toBeInTheDocument();
  });

  it('validates required fields on submit', () => {
    render(<LogHealthIssueModal onClose={mockOnClose} onSuccess={mockOnSuccess} />);

    fireEvent.click(screen.getByText('Save'));

    expect(screen.getByText('Title is required')).toBeInTheDocument();
    expect(screen.getByText('Start date is required')).toBeInTheDocument();
  });

  it('calls onSuccess when form is submitted successfully', async () => {
    const mockCreateHealthIssue = jest.fn().mockResolvedValue({ id: '1', title: 'Test Issue' });
    jest.mock('../../api/healthIssuesApi', () => ({ createHealthIssue: mockCreateHealthIssue }));

    render(<LogHealthIssueModal onClose={mockOnClose} onSuccess={mockOnSuccess} />);

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Test Issue' } });
    fireEvent.change(screen.getByLabelText('Start Date'), { target: { value: '2025-04-01' } });
    fireEvent.click(screen.getByText('Save'));

    expect(mockCreateHealthIssue).toHaveBeenCalledWith({
      title: 'Test Issue',
      description: '',
      start_date: '2025-04-01',
      status: 'active',
      severity: 'medium',
    });
    expect(mockOnSuccess).toHaveBeenCalledWith({ id: '1', title: 'Test Issue' });
  });
});