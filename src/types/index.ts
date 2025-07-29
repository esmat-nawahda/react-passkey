export interface PasskeyUser {
  id: string;
  name: string;
  displayName: string;
}

export interface PasskeyP256PublicKey {
  kty: number;        // 2 for EC2
  alg: number;        // -7 for ES256  
  crv: number;        // 1 for P-256
  x: string;          // base64 encoded x coordinate
  y: string;          // base64 encoded y coordinate
  extracted: boolean; // true if successfully extracted from WebAuthn
}

export interface PasskeyCredential {
  id: string;
  publicKey: PasskeyP256PublicKey; // Direct P-256 coordinates, no nesting
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