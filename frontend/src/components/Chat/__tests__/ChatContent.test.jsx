import React from 'react';
import { render, screen } from '@testing-library/react';
import ChatContent from '../ChatContent';

describe('ChatContent Component', () => {
  it('renders empty state when no messages are present', () => {
    render(<ChatContent messages={[]} />);
    expect(screen.getByText('No messages yet. Start a conversation!')).toBeInTheDocument();
  });

  it('renders messages when provided', () => {
    const messages = [
      { id: '1', sender: 'user', content: 'Hello!' },
      { id: '2', sender: 'bot', content: 'Hi there!' },
    ];

    render(<ChatContent messages={messages} />);

    expect(screen.getByText('Hello!')).toBeInTheDocument();
    expect(screen.getByText('Hi there!')).toBeInTheDocument();
  });
});