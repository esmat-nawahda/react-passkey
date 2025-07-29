import { useState } from 'react';
import {
  PasskeyProvider,
  usePasskey,
  PasskeyButton,
  PasskeyManager,
  PasskeyStatus,
} from '@react-passkey/core';
import type { PasskeyCredential } from '@react-passkey/core';
import './App.css';

function PasskeyDemo() {
  const { isSupported, isRegistering, isAuthenticating, credentials } = usePasskey();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [lastAuthenticatedUser, setLastAuthenticatedUser] = useState<string | null>(null);

  // Debug logging
  console.log('Passkey Support:', isSupported);
  console.log('Stored Credentials:', credentials);

  const handleRegistrationSuccess = (credential: PasskeyCredential) => {
    console.log('Registration success:', credential);
    setMessage({ 
      type: 'success', 
      text: `Successfully registered passkey for ${credential.userId}! You can now sign in with your passkey.` 
    });
    setEmail('');
    setName('');
  };

  const handleAuthenticationSuccess = (credentialId: string) => {
    console.log('Authentication success:', credentialId);
    
    // Find the credential in our stored credentials
    const credential = credentials.find(c => c.id === credentialId);
    if (credential) {
      setLastAuthenticatedUser(credential.userId);
      setMessage({ 
        type: 'success', 
        text: `Welcome back, ${credential.userId}! Successfully authenticated with passkey.` 
      });
    } else {
      // This can happen if authenticating with a passkey not stored locally
      setMessage({ 
        type: 'info', 
        text: `Successfully authenticated with passkey ID: ${credentialId.substring(0, 10)}...` 
      });
    }
  };

  const handleError = (error: Error) => {
    console.error('Passkey error:', error);
    setMessage({ type: 'error', text: error.message });
  };

  const handleDeleteCredential = (credential: PasskeyCredential) => {
    setMessage({ 
      type: 'info', 
      text: `Deleted passkey for ${credential.userId}` 
    });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>React Passkey Library Demo</h1>

      <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f0f0f0', borderRadius: '8px' }}>
        <h2>Status</h2>
        <PasskeyStatus />
        {!isSupported && (
          <div style={{ marginTop: '1rem', color: 'red' }}>
            ⚠️ Passkeys are not supported in this browser. Please use Chrome, Safari, or Edge on a device with biometric authentication.
          </div>
        )}
        {lastAuthenticatedUser && (
          <div style={{ marginTop: '1rem', color: 'green' }}>
            Last authenticated as: <strong>{lastAuthenticatedUser}</strong>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '2rem', padding: '1rem', background: '#e8f4fd', borderRadius: '8px' }}>
        <h2>How to Use</h2>
        <ol style={{ textAlign: 'left', marginLeft: '1rem' }}>
          <li>First, register a new passkey by entering your email and name below</li>
          <li>Your device will prompt you to use biometric authentication (Touch ID, Face ID, etc.)</li>
          <li>After registration, you can sign in using the "Sign In with Passkey" button</li>
          <li>Manage your registered passkeys in the section below</li>
        </ol>
      </div>

      <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f9f9f9', borderRadius: '8px' }}>
        <h2>Step 1: Register New Passkey</h2>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="name">Display Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
          />
        </div>
        <PasskeyButton
          mode="register"
          disabled={!email || !name}
          registrationOptions={{
            user: email && name ? {
              id: email,
              name: email,
              displayName: name,
            } : undefined,
          }}
          onSuccess={handleRegistrationSuccess}
          onError={handleError}
        >
          {isRegistering ? 'Registering...' : 'Register Passkey'}
        </PasskeyButton>
      </div>

      <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f9f9f9', borderRadius: '8px' }}>
        <h2>Step 2: Authenticate</h2>
        <p style={{ marginBottom: '1rem', textAlign: 'left' }}>
          {credentials.length === 0 
            ? "No passkeys registered yet. Please register one first."
            : "Click below to authenticate with your registered passkey."}
        </p>
        <PasskeyButton
          mode="authenticate"
          onSuccess={handleAuthenticationSuccess}
          onError={handleError}
        >
          {isAuthenticating ? 'Authenticating...' : 'Sign In with Passkey'}
        </PasskeyButton>
        
        {credentials.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>
              You have {credentials.length} passkey(s) registered on this device.
            </p>
          </div>
        )}
      </div>

      {message && (
        <div style={{
          padding: '1rem',
          marginBottom: '2rem',
          background: message.type === 'success' ? '#d4edda' : message.type === 'error' ? '#f8d7da' : '#cce5ff',
          color: message.type === 'success' ? '#155724' : message.type === 'error' ? '#721c24' : '#004085',
          borderRadius: '8px',
          border: `1px solid ${message.type === 'success' ? '#c3e6cb' : message.type === 'error' ? '#f5c6cb' : '#b8daff'}`
        }}>
          {message.text}
        </div>
      )}

      <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f9f9f9', borderRadius: '8px' }}>
        <h2>Step 3: Manage Your Passkeys ({credentials.length})</h2>
        <PasskeyManager 
          emptyMessage="No passkeys registered yet. Register one above to get started!"
          onDelete={handleDeleteCredential}
          renderCredential={(credential, onDelete) => (
            <div style={{
              padding: '1rem',
              marginBottom: '1rem',
              background: '#fff',
              borderRadius: '8px',
              border: '1px solid #ddd'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>{credential.userId}</h4>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                <p style={{ margin: '0.25rem 0' }}>
                  <strong>Created:</strong> {credential.createdAt.toLocaleString()}
                </p>
                {credential.lastUsed && (
                  <p style={{ margin: '0.25rem 0' }}>
                    <strong>Last used:</strong> {credential.lastUsed.toLocaleString()}
                  </p>
                )}
                <p style={{ margin: '0.25rem 0' }}>
                  <strong>Credential ID:</strong> {credential.id.substring(0, 20)}...
                </p>
              </div>
              <button
                onClick={onDelete}
                style={{
                  marginTop: '0.5rem',
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Delete Passkey
              </button>
            </div>
          )}
        />
      </div>

      <div style={{ marginTop: '3rem', padding: '1rem', background: '#f0f0f0', borderRadius: '8px' }}>
        <h3>Integration Example</h3>
        <pre style={{ 
          textAlign: 'left', 
          background: '#2d2d2d', 
          color: '#fff', 
          padding: '1rem', 
          borderRadius: '4px',
          overflow: 'auto',
          fontSize: '0.9rem'
        }}>
{`import { PasskeyProvider, PasskeyButton } from '@react-passkey/core';

function App() {
  const handleSuccess = (result) => {
    console.log('Success!', result);
    // Send to your backend for verification
  };

  return (
    <PasskeyProvider>
      <PasskeyButton
        mode="register"
        registrationOptions={{
          user: {
            id: 'user@example.com',
            name: 'user@example.com',
            displayName: 'John Doe'
          }
        }}
        onSuccess={handleSuccess}
        onError={(err) => console.error(err)}
      />
    </PasskeyProvider>
  );
}`}</pre>
      </div>
    </div>
  );
}

function App() {
  return (
    <PasskeyProvider storageKey="demo-passkeys">
      <PasskeyDemo />
    </PasskeyProvider>
  );
}

export default App;