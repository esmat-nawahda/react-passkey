import React from 'react';
import { render, screen } from '@testing-library/react';
import { PasskeyStatus } from '../../components/PasskeyStatus';

// Mock the context
jest.mock('../../hooks/usePasskeyContext', () => ({
  usePasskey: jest.fn(() => ({
    isSupported: true,
    credentials: [],
  })),
}));

const { usePasskey } = require('../../hooks/usePasskeyContext');

describe('PasskeyStatus', () => {
  beforeEach(() => {
    usePasskey.mockReturnValue({
      isSupported: true,
      credentials: [],
    });
  });

  it('should show supported message when passkeys are supported', () => {
    render(<PasskeyStatus />);
    expect(screen.getByText(/Passkeys are supported on this device/)).toBeInTheDocument();
  });

  it('should show unsupported message when passkeys are not supported', () => {
    usePasskey.mockReturnValue({
      isSupported: false,
      credentials: [],
    });

    render(<PasskeyStatus />);
    expect(screen.getByText(/Passkeys are not supported on this device/)).toBeInTheDocument();
  });

  it('should show custom messages', () => {
    render(
      <PasskeyStatus
        supportedMessage="Ready to go!"
        unsupportedMessage="Not available"
      />
    );
    
    expect(screen.getByText(/Ready to go!/)).toBeInTheDocument();
  });

  it('should show credential count when supported', () => {
    usePasskey.mockReturnValue({
      isSupported: true,
      credentials: [{ id: '1' }, { id: '2' }],
    });

    render(<PasskeyStatus />);
    expect(screen.getByText(/Registered passkeys:/)).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should hide credential count when showCredentialCount is false', () => {
    usePasskey.mockReturnValue({
      isSupported: true,
      credentials: [{ id: '1' }, { id: '2' }],
    });

    render(<PasskeyStatus showCredentialCount={false} />);
    expect(screen.queryByText(/Registered passkeys:/)).not.toBeInTheDocument();
  });

  it('should not show credential count when not supported', () => {
    usePasskey.mockReturnValue({
      isSupported: false,
      credentials: [],
    });

    render(<PasskeyStatus />);
    expect(screen.queryByText(/Registered passkeys:/)).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<PasskeyStatus className="custom-status" />);
    
    const container = screen.getByText(/Passkeys are supported/).closest('div');
    expect(container?.parentElement).toHaveClass('custom-status');
  });
});