// Hooks
export { usePasskey, PasskeyProvider } from './hooks/usePasskeyContext';
export { usePasskeySupport } from './hooks/usePasskeySupport';
export { usePasskeyRegistration } from './hooks/usePasskeyRegistration';
export { usePasskeyAuthentication } from './hooks/usePasskeyAuthentication';

// Components
export { PasskeyButton } from './components/PasskeyButton';
export { PasskeyManager } from './components/PasskeyManager';
export { PasskeyStatus } from './components/PasskeyStatus';

// Utils
export * from './utils/passkey-utils';
export { LocalStorageAdapter, MemoryStorageAdapter } from './utils/storage';

// Types
export * from './types';

// Version
export const version = '0.1.0';