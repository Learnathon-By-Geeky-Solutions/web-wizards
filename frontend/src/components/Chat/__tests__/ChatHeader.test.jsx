import React from 'react';
import { render, screen } from '@testing-library/react';
import ChatHeader from '../ChatHeader';

describe('ChatHeader Component', () => {
  it('renders the header with user information', () => {
    const user = { name: 'John Doe' };

    render(<ChatHeader user={user} />);

    expect(screen.getByText('Messages')).toBeInTheDocument();
    expect(screen.getByText('Connect with healthcare providers')).toBeInTheDocument();
  });
});