import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MessageInput from '../MessageInput';

describe('MessageInput Component', () => {
  const mockOnSendMessage = jest.fn();

  it('renders the input and send button', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} />);

    expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('disables the send button when input is empty', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} />);

    const sendButton = screen.getByRole('button');
    expect(sendButton).toBeDisabled();
  });

  it('enables the send button when input is not empty', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} />);

    const input = screen.getByPlaceholderText('Type a message...');
    fireEvent.change(input, { target: { value: 'Hello' } });

    const sendButton = screen.getByRole('button');
    expect(sendButton).not.toBeDisabled();
  });

  it('calls onSendMessage with the input value when submitted', () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} />);

    const input = screen.getByPlaceholderText('Type a message...');
    fireEvent.change(input, { target: { value: 'Hello' } });

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(mockOnSendMessage).toHaveBeenCalledWith('Hello');
    expect(input.value).toBe('');
  });
});