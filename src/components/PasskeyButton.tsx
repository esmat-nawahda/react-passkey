import React from 'react';
import { usePasskey } from '../hooks/usePasskeyContext';
import type { PasskeyRegistrationOptions, PasskeyAuthenticationOptions } from '../types';

export interface PasskeyButtonProps {
  mode: 'register' | 'authenticate';
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  registrationOptions?: Omit<PasskeyRegistrationOptions, 'user'> & { user?: PasskeyRegistrationOptions['user'] };
  authenticationOptions?: PasskeyAuthenticationOptions;
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
}

export const PasskeyButton: React.FC<PasskeyButtonProps> = ({
  mode,
  children,
  className,
  disabled,
  registrationOptions,
  authenticationOptions,
  onSuccess,
  onError,
}) => {
  const { isSupported, isRegistering, isAuthenticating, register, authenticate } = usePasskey();

  const handleClick = async () => {
    console.log('PasskeyButton clicked, mode:', mode);
    try {
      if (mode === 'register') {
        if (!registrationOptions?.user) {
          throw new Error('User information is required for registration');
        }
        const credential = await register(registrationOptions as PasskeyRegistrationOptions);
        onSuccess?.(credential);
      } else {
        const credentialId = await authenticate(authenticationOptions);
        onSuccess?.(credentialId);
      }
    } catch (error) {
      console.error('PasskeyButton error:', error);
      onError?.(error as Error);
    }
  };

  const isLoading = mode === 'register' ? isRegistering : isAuthenticating;
  const defaultLabel = mode === 'register' ? 'Register with Passkey' : 'Sign in with Passkey';

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || !isSupported || isLoading}
      className={className}
      aria-busy={isLoading}
      aria-label={isLoading ? 'Processing...' : undefined}
    >
      {children || defaultLabel}
    </button>
  );
};