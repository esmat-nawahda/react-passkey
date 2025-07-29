import { useState, useCallback } from 'react';
import type { PasskeyRegistrationOptions, PasskeyCredential } from '../types';
import {
  generateChallenge,
  bufferToBase64,
  extractPublicKeyFromCredential,
} from '../utils/passkey-utils';

export const usePasskeyRegistration = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const register = useCallback(async (options: PasskeyRegistrationOptions): Promise<PasskeyCredential> => {
    console.log('Starting registration with options:', options);
    setIsRegistering(true);
    setError(null);

    try {
      const challenge = options.challenge || generateChallenge();
      
      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: {
          name: window.location.hostname,
          id: window.location.hostname,
        },
        user: {
          id: new TextEncoder().encode(options.user.id),
          name: options.user.name,
          displayName: options.user.displayName,
        },
        pubKeyCredParams: [
          { alg: -7, type: 'public-key' }, // ES256
          { alg: -257, type: 'public-key' }, // RS256
        ],
        authenticatorSelection: options.authenticatorSelection || {
          authenticatorAttachment: 'platform',
          requireResidentKey: true,
          residentKey: 'required',
          userVerification: 'preferred',
        },
        timeout: options.timeout || 60000,
        attestation: options.attestation || 'direct',
        excludeCredentials: options.excludeCredentials?.map((id) => ({
          id: new TextEncoder().encode(id),
          type: 'public-key',
        })),
      };

      console.log('Calling navigator.credentials.create with:', publicKeyCredentialCreationOptions);

      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      }) as PublicKeyCredential;

      if (!credential) {
        throw new Error('Failed to create credential');
      }

      console.log('Credential created successfully:', credential);

      const passkeyCredential: PasskeyCredential = {
        id: bufferToBase64(credential.rawId),
        publicKey: extractPublicKeyFromCredential(credential),
        userId: options.user.id,
        createdAt: new Date(),
        transports: (credential.response as AuthenticatorAttestationResponse).getTransports?.() as AuthenticatorTransport[] || [],
      };

      options.onSuccess?.(passkeyCredential);
      return passkeyCredential;
    } catch (err) {
      console.error('Registration error:', err);
      const error = err instanceof Error ? err : new Error('Registration failed');
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setIsRegistering(false);
    }
  }, []);

  return {
    register,
    isRegistering,
    error,
  };
};