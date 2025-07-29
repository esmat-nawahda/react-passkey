import React from 'react';
import { usePasskey } from '../hooks/usePasskeyContext';

export interface PasskeyStatusProps {
  showCredentialCount?: boolean;
  className?: string;
  supportedMessage?: string;
  unsupportedMessage?: string;
}

export const PasskeyStatus: React.FC<PasskeyStatusProps> = ({
  showCredentialCount = true,
  className,
  supportedMessage = 'Passkeys are supported on this device',
  unsupportedMessage = 'Passkeys are not supported on this device',
}) => {
  const { isSupported, credentials } = usePasskey();

  return (
    <div className={className}>
      <div style={{ marginBottom: '0.5rem' }}>
        {isSupported ? (
          <span style={{ color: 'green' }}>✓ {supportedMessage}</span>
        ) : (
          <span style={{ color: 'red' }}>✗ {unsupportedMessage}</span>
        )}
      </div>
      {showCredentialCount && isSupported && (
        <div>
          Registered passkeys: <strong>{credentials.length}</strong>
        </div>
      )}
    </div>
  );
};