import '@testing-library/jest-dom';

// Mock WebAuthn API
const mockCredential = {
  id: 'mock-credential-id',
  type: 'public-key',
  rawId: new ArrayBuffer(32),
  response: {
    clientDataJSON: new ArrayBuffer(128),
    attestationObject: new ArrayBuffer(256),
    authenticatorData: new ArrayBuffer(64),
    signature: new ArrayBuffer(64),
    userHandle: new ArrayBuffer(16),
  },
};

Object.defineProperty(global.navigator, 'credentials', {
  value: {
    create: jest.fn().mockResolvedValue(mockCredential),
    get: jest.fn().mockResolvedValue(mockCredential),
    store: jest.fn(),
    preventSilentAccess: jest.fn(),
  },
  configurable: true,
});

// Mock PublicKeyCredential
global.PublicKeyCredential = jest.fn() as any;
global.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable = jest
  .fn()
  .mockResolvedValue(true);
global.PublicKeyCredential.isConditionalMediationAvailable = jest
  .fn()
  .mockResolvedValue(true);