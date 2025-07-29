import { useState } from 'react';
import {
  PasskeyProvider,
  usePasskey,
  PasskeyButton,
  PasskeyManager,
  PasskeyStatus,
} from '@esmatnawahda/react-passkey';
import type { PasskeyCredential } from '@esmatnawahda/react-passkey';
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

      <div className="demo-card status-card">
        <h2>Status</h2>
        <PasskeyStatus />
        {!isSupported && (
          <div style={{ marginTop: '1rem', color: '#f87171' }}>
            ⚠️ Passkeys are not supported in this browser. Please use Chrome, Safari, or Edge on a device with biometric authentication.
          </div>
        )}
        {lastAuthenticatedUser && (
          <div style={{ marginTop: '1rem', color: '#4ade80' }}>
            Last authenticated as: <strong>{lastAuthenticatedUser}</strong>
          </div>
        )}
      </div>

      <div className="demo-card demo-card-light">
        <h2>How to Use</h2>
        <ol style={{ marginLeft: '1rem' }}>
          <li>First, register a new passkey by entering your email and name below</li>
          <li>Your device will prompt you to use biometric authentication (Touch ID, Face ID, etc.)</li>
          <li>After registration, you can sign in using the "Sign In with Passkey" button</li>
          <li>Manage your registered passkeys in the section below</li>
        </ol>
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#2a2a2a', borderRadius: '8px' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#d0d0d0' }}>
            <strong>Note:</strong> This demo requires HTTPS to work properly. Passkeys only function over secure connections.
            The GitHub Pages deployment automatically provides HTTPS.
          </p>
        </div>
      </div>

      <div className="demo-card">
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

      <div className="demo-card">
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
        <div className={`demo-card ${message.type === 'success' ? 'success-message' : message.type === 'error' ? 'error-message' : 'info-message'}`}
             style={{ padding: '1rem', marginBottom: '2rem' }}>
          {message.text}
        </div>
      )}

      <div className="demo-card">
        <h2>Step 3: Manage Your Passkeys ({credentials.length})</h2>
        <PasskeyManager 
          emptyMessage="No passkeys registered yet. Register one above to get started!"
          onDelete={handleDeleteCredential}
          renderCredential={(credential, onDelete) => (
            <div style={{
              padding: '1rem',
              marginBottom: '1rem',
              background: '#0a0a0a',
              borderRadius: '8px',
              border: '1px solid #2a2a2a'
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
                className="delete-button"
                style={{
                  marginTop: '0.5rem',
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

      <div className="demo-card demo-card-light" style={{ marginTop: '3rem' }}>
        <h3>Integration Example</h3>
        <pre style={{ 
          textAlign: 'left', 
          padding: '1rem', 
          borderRadius: '8px',
          overflow: 'auto',
          fontSize: '0.9rem'
        }}>
{`import { PasskeyProvider, PasskeyButton } from '@esmatnawahda/react-passkey';

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