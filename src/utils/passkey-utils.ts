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

export const extractPublicKeyFromCredential = (credential: PublicKeyCredential): any => {
  if (!('response' in credential) || !('attestationObject' in credential.response)) {
    throw new Error('Invalid credential format');
  }
  
  const response = credential.response as AuthenticatorAttestationResponse;
  
  try {
    // Real WebAuthn credential data extraction
    const attestationObject = response.attestationObject;
    const clientDataJSON = response.clientDataJSON;
    const authenticatorData = response.getAuthenticatorData?.() || null;
    
    // Parse client data JSON to get challenge and origin
    const clientData = JSON.parse(new TextDecoder().decode(clientDataJSON));
    
    // Extract real credential information
    const credentialData = {
      // Core credential information
      credentialId: bufferToBase64(credential.rawId),
      type: credential.type,
      
      // Real WebAuthn response data
      attestationObject: bufferToBase64(attestationObject),
      clientDataJSON: bufferToBase64(clientDataJSON),
      authenticatorData: authenticatorData ? bufferToBase64(authenticatorData) : null,
      
      // Client data details
      clientData: {
        type: clientData.type,
        challenge: clientData.challenge,
        origin: clientData.origin,
        crossOrigin: clientData.crossOrigin || false,
      },
      
      // Transport methods supported by authenticator
      transports: response.getTransports?.() || [],
      
      // Timestamp
      timestamp: Date.now(),
      
      // Note about public key extraction
      note: 'Real WebAuthn credential - public key requires CBOR parsing for production use',
      
      // Basic metadata
      algorithm: -7, // ES256 algorithm identifier (standard default)
    };
    
    console.log('Real WebAuthn credential created:', credentialData);
    return credentialData;
    
  } catch (error) {
    console.error('Error extracting credential data:', error);
    
    // Fallback with clear indication this is fallback data
    return {
      credentialId: bufferToBase64(credential.rawId),
      type: credential.type,
      algorithm: -7,
      error: 'Could not parse full credential data',
      fallback: true,
      timestamp: Date.now(),
      note: 'This is fallback data due to parsing error'
    };
  }
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