import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PasskeyManager } from '../../components/PasskeyManager';
import { PasskeyProvider } from '../../hooks/usePasskeyContext';
import type { PasskeyCredential } from '../../types';

const mockCredentials: PasskeyCredential[] = [
  {
    id: 'cred-1',
    publicKey: 'key-1',
    userId: 'user-1',
    createdAt: new Date('2024-01-01'),
    deviceName: 'iPhone',
    lastUsed: new Date('2024-01-15'),
  },
  {
    id: 'cred-2',
    publicKey: 'key-2',
    userId: 'user-1',
    createdAt: new Date('2024-01-10'),
  },
];

// Mock the context
jest.mock('../../hooks/usePasskeyContext', () => ({
  ...jest.requireActual('../../hooks/usePasskeyContext'),
  usePasskey: jest.fn(() => ({
    credentials: [],
    deleteCredential: jest.fn(),
  })),
}));

const { usePasskey } = require('../../hooks/usePasskeyContext');

describe('PasskeyManager', () => {
  beforeEach(() => {
    usePasskey.mockReturnValue({
      credentials: [],
      deleteCredential: jest.fn(),
    });
  });

  it('should show empty message when no credentials', () => {
    render(<PasskeyManager />);
    expect(screen.getByText('No passkeys registered')).toBeInTheDocument();
  });

  it('should show custom empty message', () => {
    render(<PasskeyManager emptyMessage="No devices found" />);
    expect(screen.getByText('No devices found')).toBeInTheDocument();
  });

  it('should render credentials list', () => {
    usePasskey.mockReturnValue({
      credentials: mockCredentials,
      deleteCredential: jest.fn(),
    });

    render(<PasskeyManager />);

    expect(screen.getByText('iPhone')).toBeInTheDocument();
    expect(screen.getByText('Unknown Device')).toBeInTheDocument();
    expect(screen.getAllByText(/Created:/)).toHaveLength(2);
    expect(screen.getByText(/Last used:/)).toBeInTheDocument();
  });

  it('should call deleteCredential when delete button is clicked', async () => {
    const deleteCredentialMock = jest.fn();
    usePasskey.mockReturnValue({
      credentials: mockCredentials,
      deleteCredential: deleteCredentialMock,
    });

    render(<PasskeyManager />);

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(deleteCredentialMock).toHaveBeenCalledWith('cred-1');
  });

  it('should call onDelete callback', async () => {
    const onDeleteMock = jest.fn();
    const deleteCredentialMock = jest.fn().mockResolvedValue(undefined);
    usePasskey.mockReturnValue({
      credentials: mockCredentials,
      deleteCredential: deleteCredentialMock,
    });

    render(<PasskeyManager onDelete={onDeleteMock} />);

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(deleteCredentialMock).toHaveBeenCalledWith('cred-1');
    });
    
    await waitFor(() => {
      expect(onDeleteMock).toHaveBeenCalledWith(mockCredentials[0]);
    });
  });

  it('should use custom renderCredential function', () => {
    usePasskey.mockReturnValue({
      credentials: mockCredentials,
      deleteCredential: jest.fn(),
    });

    const renderCredential = (credential: PasskeyCredential, onDelete: () => void) => (
      <div>
        <span>Custom: {credential.id}</span>
        <button onClick={onDelete}>Remove</button>
      </div>
    );

    render(<PasskeyManager renderCredential={renderCredential} />);

    expect(screen.getByText('Custom: cred-1')).toBeInTheDocument();
    expect(screen.getByText('Custom: cred-2')).toBeInTheDocument();
    expect(screen.getAllByText('Remove')).toHaveLength(2);
  });

  it('should apply custom className', () => {
    render(<PasskeyManager className="custom-manager" />);
    
    const container = screen.getByText('No passkeys registered');
    expect(container).toHaveClass('custom-manager');
  });
});