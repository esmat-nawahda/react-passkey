export interface PasskeyUser {
  id: string;
  name: string;
  displayName: string;
}

export interface PasskeyP256PublicKey {
  kty: number;
  alg: number;
  crv: number;
  x: string;
  y: string;
  extracted: boolean;
  [key: string]: any;
}

export interface PasskeyCredential {
  id: string;
  publicKey: PasskeyP256PublicKey | string; // Union type for backward compatibility
  userId: string;
  createdAt: Date;
  lastUsed?: Date;
  deviceName?: string;
  transports?: AuthenticatorTransport[];
}

export interface PasskeyRegistrationOptions {
  user: PasskeyUser;
  challenge?: BufferSource;
  excludeCredentials?: string[];
  authenticatorSelection?: AuthenticatorSelectionCriteria;
  attestation?: AttestationConveyancePreference;
  timeout?: number;
  onSuccess?: (credential: PasskeyCredential) => void;
  onError?: (error: Error) => void;
}

export interface PasskeyAuthenticationOptions {
  challenge?: BufferSource;
  allowCredentials?: string[];
  userVerification?: UserVerificationRequirement;
  timeout?: number;
  onSuccess?: (credentialId: string) => void;
  onError?: (error: Error) => void;
}

export interface PasskeyContextValue {
  isSupported: boolean;
  isRegistering: boolean;
  isAuthenticating: boolean;
  credentials: PasskeyCredential[];
  register: (options: PasskeyRegistrationOptions) => Promise<PasskeyCredential>;
  authenticate: (options?: PasskeyAuthenticationOptions) => Promise<string>;
  deleteCredential: (credentialId: string) => Promise<void>;
  clearCredentials: () => void;
}

export interface PasskeyProviderProps {
  children: React.ReactNode;
  storageKey?: string;
}

export type PasskeyStorageAdapter = {
  getCredentials: () => Promise<PasskeyCredential[]>;
  saveCredential: (credential: PasskeyCredential) => Promise<void>;
  deleteCredential: (credentialId: string) => Promise<void>;
  clearCredentials: () => Promise<void>;
};