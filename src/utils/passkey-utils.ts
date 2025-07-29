// ox library will be used in future implementations

export const bufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
  return btoa(binary);
};

export const base64ToBuffer = (base64: string): ArrayBuffer => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

export const generateChallenge = (): ArrayBuffer => {
  const challenge = new Uint8Array(32);
  crypto.getRandomValues(challenge);
  return challenge.buffer;
};

export const isPasskeySupported = async (): Promise<boolean> => {
  if (!window.PublicKeyCredential) {
    return false;
  }

  try {
    const [platformSupport, conditionalSupport] = await Promise.all([
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable(),
      PublicKeyCredential.isConditionalMediationAvailable?.() ?? Promise.resolve(false),
    ]);

    return platformSupport || conditionalSupport;
  } catch {
    return false;
  }
};

export const parseAuthenticatorData = (authData: ArrayBuffer) => {
  const dataView = new DataView(authData);
  const rpIdHash = authData.slice(0, 32);
  const flags = dataView.getUint8(32);
  const signCount = dataView.getUint32(33, false);

  return {
    rpIdHash: bufferToBase64(rpIdHash),
    flags: {
      userPresent: !!(flags & 0x01),
      userVerified: !!(flags & 0x04),
      backupEligibility: !!(flags & 0x08),
      backupState: !!(flags & 0x10),
      attestedCredentialData: !!(flags & 0x40),
      extensionData: !!(flags & 0x80),
    },
    signCount,
  };
};

export const extractPublicKeyFromCredential = (credential: PublicKeyCredential): string => {
  if (!('response' in credential) || !('attestationObject' in credential.response)) {
    throw new Error('Invalid credential format');
  }
  
  // For demo purposes, we'll return a base64 encoded version of the credential ID
  // In a real implementation, you'd extract the actual public key from the attestation object
  return bufferToBase64(credential.rawId);
};

export const verifySignature = async (
  _publicKey: string,
  signature: ArrayBuffer,
  data: ArrayBuffer
): Promise<boolean> => {
  try {
    // This is a simplified verification for demo purposes
    // In production, you'd use proper cryptographic verification with the public key
    return signature.byteLength > 0 && data.byteLength > 0;
  } catch {
    return false;
  }
};