import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { PasskeyContextValue, PasskeyProviderProps, PasskeyCredential, PasskeyStorageAdapter } from '../types';
import { LocalStorageAdapter } from '../utils/storage';
import { usePasskeySupport } from './usePasskeySupport';
import { usePasskeyRegistration } from './usePasskeyRegistration';
import { usePasskeyAuthentication } from './usePasskeyAuthentication';

const PasskeyContext = createContext<PasskeyContextValue | null>(null);

export const usePasskey = () => {
  const context = useContext(PasskeyContext);
  if (!context) {
    throw new Error('usePasskey must be used within a PasskeyProvider');
  }
  return context;
};

export const PasskeyProvider: React.FC<PasskeyProviderProps> = ({
  children,
  storageKey = 'react-passkey-credentials',
}) => {
  const [credentials, setCredentials] = useState<PasskeyCredential[]>([]);
  const { isSupported } = usePasskeySupport();
  const { register, isRegistering } = usePasskeyRegistration();
  const { authenticate, isAuthenticating } = usePasskeyAuthentication();

  const storage: PasskeyStorageAdapter = useMemo(
    () => new LocalStorageAdapter(storageKey),
    [storageKey]
  );

  useEffect(() => {
    const loadCredentials = async () => {
      const stored = await storage.getCredentials();
      setCredentials(stored);
    };
    loadCredentials();
  }, [storage]);

  const registerWithStorage = useCallback(
    async (options: any) => {
      const credential = await register(options);
      await storage.saveCredential(credential);
      setCredentials((prev) => [...prev, credential]);
      return credential;
    },
    [register, storage]
  );

  const authenticateWithStorage = useCallback(
    async (options?: any) => {
      const credentialId = await authenticate(options);
      
      // Update last used time
      const credential = credentials.find((c) => c.id === credentialId);
      if (credential) {
        const updated = { ...credential, lastUsed: new Date() };
        await storage.saveCredential(updated);
        setCredentials((prev) =>
          prev.map((c) => (c.id === credentialId ? updated : c))
        );
      }
      
      return credentialId;
    },
    [authenticate, credentials, storage]
  );

  const deleteCredential = useCallback(
    async (credentialId: string) => {
      await storage.deleteCredential(credentialId);
      setCredentials((prev) => prev.filter((c) => c.id !== credentialId));
    },
    [storage]
  );

  const clearCredentials = useCallback(() => {
    storage.clearCredentials();
    setCredentials([]);
  }, [storage]);

  const value: PasskeyContextValue = {
    isSupported: isSupported ?? false,
    isRegistering,
    isAuthenticating,
    credentials,
    register: registerWithStorage,
    authenticate: authenticateWithStorage,
    deleteCredential,
    clearCredentials,
  };

  return <PasskeyContext.Provider value={value}>{children}</PasskeyContext.Provider>;
};