import React from 'react';
import { usePasskey } from '../hooks/usePasskeyContext';
import type { PasskeyCredential } from '../types';

export interface PasskeyManagerProps {
  className?: string;
  onDelete?: (credential: PasskeyCredential) => void;
  renderCredential?: (credential: PasskeyCredential, onDelete: () => void) => React.ReactNode;
  emptyMessage?: string;
}

export const PasskeyManager: React.FC<PasskeyManagerProps> = ({
  className,
  onDelete,
  renderCredential,
  emptyMessage = 'No passkeys registered',
}) => {
  const { credentials, deleteCredential } = usePasskey();

  const handleDelete = async (credential: PasskeyCredential) => {
    await deleteCredential(credential.id);
    onDelete?.(credential);
  };

  if (credentials.length === 0) {
    return <div className={className}>{emptyMessage}</div>;
  }

  return (
    <div className={className}>
      {credentials.map((credential) => {
        if (renderCredential) {
          return (
            <div key={credential.id}>
              {renderCredential(credential, () => handleDelete(credential))}
            </div>
          );
        }

        return (
          <div key={credential.id} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '0.5rem' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Device:</strong> {credential.deviceName || 'Unknown Device'}
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Created:</strong> {credential.createdAt.toLocaleDateString()}
            </div>
            {credential.lastUsed && (
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Last used:</strong> {credential.lastUsed.toLocaleDateString()}
              </div>
            )}
            <button
              type="button"
              onClick={() => handleDelete(credential)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer',
              }}
            >
              Delete
            </button>
          </div>
        );
      })}
    </div>
  );
};