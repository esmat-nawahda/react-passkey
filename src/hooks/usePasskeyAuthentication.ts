import { useState, useCallback } from 'react';
import type { PasskeyAuthenticationOptions } from '../types';
import { generateChallenge, bufferToBase64, base64ToBuffer } from '../utils/passkey-utils';

export const usePasskeyAuthentication = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const authenticate = useCallback(async (options?: PasskeyAuthenticationOptions): Promise<string> => {
    console.log('Starting authentication with options:', options);
    setIsAuthenticating(true);
    setError(null);

    try {
      const challenge = options?.challenge || generateChallenge();
      
      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
        challenge,
        timeout: options?.timeout || 60000,
        userVerification: options?.userVerification || 'preferred',
        rpId: window.location.hostname,
      };

      // Only add allowCredentials if we have specific credentials to allow
      if (options?.allowCredentials && options.allowCredentials.length > 0) {
        publicKeyCredentialRequestOptions.allowCredentials = options.allowCredentials.map((id) => ({
          id: base64ToBuffer(id),
          type: 'public-key',
          transports: ['internal', 'hybrid', 'usb', 'ble', 'nfc'] as AuthenticatorTransport[],
        }));
      }

      console.log('Calling navigator.credentials.get with:', publicKeyCredentialRequestOptions);

      const credential = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
        mediation: 'optional', // Always use 'optional' for explicit authentication
      }) as PublicKeyCredential;

      if (!credential) {
        throw new Error('Authentication cancelled or failed');
      }

      const credentialId = bufferToBase64(credential.rawId);
      console.log('Authentication successful, credential ID:', credentialId);
      
      options?.onSuccess?.(credentialId);
      return credentialId;
    } catch (err) {
      console.error('Authentication error:', err);
      const error = err instanceof Error ? err : new Error('Authentication failed');
      setError(error);
      options?.onError?.(error);
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  return {
    authenticate,
    isAuthenticating,
    error,
  };
};