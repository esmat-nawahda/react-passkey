import React from 'react';
import { usePasskey } from '../hooks/usePasskeyContext';
import type { PasskeyRegistrationOptions, PasskeyAuthenticationOptions } from '../types';

export interface PasskeyButtonProps {
  mode: 'register' | 'authenticate';
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'minimal';
  size?: 'small' | 'medium' | 'large';
  registrationOptions?: Omit<PasskeyRegistrationOptions, 'user'> & { user?: PasskeyRegistrationOptions['user'] };
  authenticationOptions?: PasskeyAuthenticationOptions;
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
}

export const PasskeyButton: React.FC<PasskeyButtonProps> = ({
  mode,
  children,
  className,
  style,
  disabled,
  variant = 'default',
  size = 'medium',
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

  // Built-in style variants
  const getVariantStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      border: 'none',
      borderRadius: '8px',
      cursor: disabled || !isSupported || isLoading ? 'not-allowed' : 'pointer',
      fontWeight: '500',
      transition: 'all 0.2s ease',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    };

    const sizeStyles = {
      small: { padding: '8px 16px', fontSize: '14px' },
      medium: { padding: '12px 24px', fontSize: '16px' },
      large: { padding: '16px 32px', fontSize: '18px' },
    };

    const variantStyles = {
      default: {
        backgroundColor: '#f5f5f5',
        color: '#333',
        border: '1px solid #ddd',
      },
      primary: {
        backgroundColor: '#007bff',
        color: 'white',
      },
      secondary: {
        backgroundColor: '#6c757d',
        color: 'white',
      },
      outline: {
        backgroundColor: 'transparent',
        color: '#007bff',
        border: '2px solid #007bff',
      },
      minimal: {
        backgroundColor: 'transparent',
        color: '#007bff',
        border: 'none',
      },
    };

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
      opacity: disabled || !isSupported ? 0.6 : 1,
    };
  };

  const buttonStyle = {
    ...getVariantStyles(),
    ...style, // User styles override built-in styles
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || !isSupported || isLoading}
      className={className}
      style={buttonStyle}
      aria-busy={isLoading}
      aria-label={isLoading ? 'Processing...' : undefined}
    >
      {children || defaultLabel}
    </button>
  );
};