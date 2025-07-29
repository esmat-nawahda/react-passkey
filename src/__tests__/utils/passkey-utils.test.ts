import {
  bufferToBase64,
  base64ToBuffer,
  generateChallenge,
  isPasskeySupported,
  parseAuthenticatorData,
} from '../../utils/passkey-utils';

describe('passkey-utils', () => {
  describe('bufferToBase64', () => {
    it('should convert ArrayBuffer to base64 string', () => {
      const buffer = new Uint8Array([72, 101, 108, 108, 111]).buffer;
      const result = bufferToBase64(buffer);
      expect(result).toBe('SGVsbG8=');
    });

    it('should handle empty buffer', () => {
      const buffer = new ArrayBuffer(0);
      const result = bufferToBase64(buffer);
      expect(result).toBe('');
    });
  });

  describe('base64ToBuffer', () => {
    it('should convert base64 string to ArrayBuffer', () => {
      const base64 = 'SGVsbG8=';
      const result = base64ToBuffer(base64);
      const view = new Uint8Array(result);
      expect(view).toEqual(new Uint8Array([72, 101, 108, 108, 111]));
    });

    it('should handle empty string', () => {
      const result = base64ToBuffer('');
      expect(result.byteLength).toBe(0);
    });
  });

  describe('generateChallenge', () => {
    it('should generate a 32-byte challenge', () => {
      const challenge = generateChallenge();
      expect(challenge.byteLength).toBe(32);
    });

    it('should generate different challenges', () => {
      const challenge1 = generateChallenge();
      const challenge2 = generateChallenge();
      const view1 = new Uint8Array(challenge1);
      const view2 = new Uint8Array(challenge2);
      expect(view1).not.toEqual(view2);
    });
  });

  describe('isPasskeySupported', () => {
    it('should return true when passkeys are supported', async () => {
      const result = await isPasskeySupported();
      expect(result).toBe(true);
    });

    it('should return false when PublicKeyCredential is not available', async () => {
      const original = window.PublicKeyCredential;
      (window as any).PublicKeyCredential = undefined;
      
      const result = await isPasskeySupported();
      expect(result).toBe(false);
      
      (window as any).PublicKeyCredential = original;
    });
  });

  describe('parseAuthenticatorData', () => {
    it('should parse authenticator data correctly', () => {
      const authData = new ArrayBuffer(37);
      const view = new DataView(authData);
      // Set flags byte at position 32
      view.setUint8(32, 0b01000101); // UP, UV, AT
      // Set sign count at position 33
      view.setUint32(33, 42, false);

      const result = parseAuthenticatorData(authData);
      
      expect(result.flags.userPresent).toBe(true);
      expect(result.flags.userVerified).toBe(true);
      expect(result.flags.attestedCredentialData).toBe(true);
      expect(result.signCount).toBe(42);
    });
  });
});