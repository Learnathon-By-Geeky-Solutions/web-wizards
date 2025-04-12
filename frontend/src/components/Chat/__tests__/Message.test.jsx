import React from 'react';
import { render, screen } from '@testing-library/react';
import Message from '../Message';

describe('Message Component', () => {
  it('renders a message sent by the user', () => {
    const message = { text: 'Hello!', timestamp: Date.now() };

    render(<Message message={message} isOwnMessage={true} />);

    expect(screen.getByText('Hello!')).toBeInTheDocument();
    expect(screen.getByText(/\d{1,2}:\d{2} (AM|PM)/)).toBeInTheDocument();
    expect(screen.getByText('Hello!').closest('div')).toHaveClass('bg-teal-500');
  });

  it('renders a message received from others', () => {
    const message = { text: 'Hi there!', timestamp: Date.now() };

    render(<Message message={message} isOwnMessage={false} />);

    expect(screen.getByText('Hi there!')).toBeInTheDocument();
    expect(screen.getByText(/\d{1,2}:\d{2} (AM|PM)/)).toBeInTheDocument();
    expect(screen.getByText('Hi there!').closest('div')).toHaveClass('bg-gray-200');
  });
});