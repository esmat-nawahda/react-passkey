import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PasskeyButton } from '../../components/PasskeyButton';
import { PasskeyProvider } from '../../hooks/usePasskeyContext';
import type { PasskeyCredential } from '../../types';

const mockUser = {
  id: 'test-user-id',
  name: 'test@example.com',
  displayName: 'Test User',
};

// Mock the hooks
jest.mock('../../hooks/usePasskeyContext', () => {
  const actual = jest.requireActual('../../hooks/usePasskeyContext');
  return {
    ...actual,
    usePasskey: jest.fn(() => ({
      isSupported: true,
      isRegistering: false,
      isAuthenticating: false,
      credentials: [],
      register: jest.fn().mockResolvedValue({
        id: 'test-credential-id',
        publicKey: 'test-public-key',
        userId: 'test-user-id',
        createdAt: new Date(),
      } as PasskeyCredential),
      authenticate: jest.fn().mockResolvedValue('test-credential-id'),
      deleteCredential: jest.fn(),
      clearCredentials: jest.fn(),
    })),
  };
});

const { usePasskey } = require('../../hooks/usePasskeyContext');

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PasskeyProvider>{children}</PasskeyProvider>
);

describe('PasskeyButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render register button with default text', () => {
    render(
      <PasskeyButton mode="register" registrationOptions={{ user: mockUser }} />,
      { wrapper: Wrapper }
    );
    
    expect(screen.getByRole('button')).toHaveTextContent('Register with Passkey');
  });

  it('should render authenticate button with default text', () => {
    render(<PasskeyButton mode="authenticate" />, { wrapper: Wrapper });
    
    expect(screen.getByRole('button')).toHaveTextContent('Sign in with Passkey');
  });

  it('should render custom children', () => {
    render(
      <PasskeyButton mode="register" registrationOptions={{ user: mockUser }}>
        Custom Text
      </PasskeyButton>,
      { wrapper: Wrapper }
    );
    
    expect(screen.getByRole('button')).toHaveTextContent('Custom Text');
  });

  it('should be disabled when passkeys are not supported', () => {
    usePasskey.mockReturnValue({
      isSupported: false,
      isRegistering: false,
      isAuthenticating: false,
      credentials: [],
      register: jest.fn(),
      authenticate: jest.fn(),
      deleteCredential: jest.fn(),
      clearCredentials: jest.fn(),
    });

    render(
      <PasskeyButton mode="register" registrationOptions={{ user: mockUser }} />,
      { wrapper: Wrapper }
    );
    
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should call onSuccess when registration succeeds', async () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();
    const mockRegister = jest.fn().mockResolvedValue({
      id: 'test-credential-id',
      publicKey: 'test-public-key',
      userId: 'test-user-id',
      createdAt: new Date(),
    });

    usePasskey.mockReturnValue({
      isSupported: true,
      isRegistering: false,
      isAuthenticating: false,
      credentials: [],
      register: mockRegister,
      authenticate: jest.fn(),
      deleteCredential: jest.fn(),
      clearCredentials: jest.fn(),
    });

    render(
      <PasskeyButton
        mode="register"
        registrationOptions={{ user: mockUser }}
        onSuccess={onSuccess}
        onError={onError}
      />,
      { wrapper: Wrapper }
    );

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({ user: mockUser });
      expect(onSuccess).toHaveBeenCalled();
    });

    expect(onError).not.toHaveBeenCalled();
  });

  it('should call onError when user is missing for registration', async () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();

    render(
      <PasskeyButton
        mode="register"
        registrationOptions={{}}
        onSuccess={onSuccess}
        onError={onError}
      />,
      { wrapper: Wrapper }
    );

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'User information is required for registration',
        })
      );
    });

    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('should handle authentication mode', async () => {
    const onSuccess = jest.fn();
    const mockAuthenticate = jest.fn().mockResolvedValue('test-credential-id');

    usePasskey.mockReturnValue({
      isSupported: true,
      isRegistering: false,
      isAuthenticating: false,
      credentials: [],
      register: jest.fn(),
      authenticate: mockAuthenticate,
      deleteCredential: jest.fn(),
      clearCredentials: jest.fn(),
    });

    render(
      <PasskeyButton mode="authenticate" onSuccess={onSuccess} />,
      { wrapper: Wrapper }
    );

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(mockAuthenticate).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalledWith('test-credential-id');
    });
  });

  it('should apply custom className', () => {
    render(
      <PasskeyButton
        mode="register"
        registrationOptions={{ user: mockUser }}
        className="custom-class"
      />,
      { wrapper: Wrapper }
    );
    
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('should be disabled when disabled prop is true', () => {
    render(
      <PasskeyButton
        mode="register"
        registrationOptions={{ user: mockUser }}
        disabled
      />,
      { wrapper: Wrapper }
    );
    
    expect(screen.getByRole('button')).toBeDisabled();
  });
});