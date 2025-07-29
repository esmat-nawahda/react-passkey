# React Passkey Library

A comprehensive React library for WebAuthn passkey authentication with TypeScript support and modern React patterns.

## 🚀 Live Demo

Check out the live demo: **[https://esmatnawahda.github.io/react-passkey/](https://esmatnawahda.github.io/react-passkey/)**

## Features

- 🔐 **Easy passkey registration and authentication**
- 🎣 **React hooks for passkey operations**
- 🧩 **Pre-built UI components**
- 💾 **Automatic credential storage management**
- 🔍 **Browser support detection**
- 📱 **Cross-platform compatibility**
- 🎨 **Customizable and extensible**
- ✅ **Fully typed with TypeScript**
- 🧪 **Comprehensive test coverage**
- 🚀 **GitHub Pages deployment ready**

## Installation

```bash
npm install react-passkey-pro
# or
yarn add react-passkey-pro
```

## Quick Start

```tsx
import { PasskeyProvider, PasskeyButton, usePasskey } from 'react-passkey-pro';

function App() {
  return (
    <PasskeyProvider>
      <MyApp />
    </PasskeyProvider>
  );
}

function MyApp() {
  const { isSupported, credentials } = usePasskey();

  return (
    <div>
      {isSupported ? (
        <>
          <PasskeyButton
            mode="register"
            registrationOptions={{
              user: {
                id: 'user@example.com',
                name: 'user@example.com',
                displayName: 'John Doe',
              },
            }}
          />
          <PasskeyButton mode="authenticate" />
        </>
      ) : (
        <p>Passkeys not supported</p>
      )}
    </div>
  );
}
```

## API Reference

### Components

#### PasskeyProvider

The main provider component that manages passkey state and operations.

```tsx
<PasskeyProvider
  storageKey="my-app-passkeys" // Optional: customize storage key
  autoDetectSupport={true}     // Optional: auto-detect browser support
>
  {children}
</PasskeyProvider>
```

#### PasskeyButton

A ready-to-use button component for registration and authentication.

```tsx
<PasskeyButton
  mode="register" // or "authenticate"
  className="custom-button"
  disabled={false}
  registrationOptions={{
    user: { id, name, displayName },
    timeout: 60000,
  }}
  onSuccess={(result) => console.log('Success!', result)}
  onError={(error) => console.error('Error:', error)}
>
  Custom Button Text
</PasskeyButton>
```

#### PasskeyManager

Component for managing registered passkeys.

```tsx
<PasskeyManager
  className="passkey-list"
  emptyMessage="No passkeys yet"
  onDelete={(credential) => console.log('Deleted:', credential)}
  renderCredential={(credential, onDelete) => (
    <CustomCredentialCard credential={credential} onDelete={onDelete} />
  )}
/>
```

#### PasskeyStatus

Display the current passkey support status.

```tsx
<PasskeyStatus
  showCredentialCount={true}
  supportedMessage="Ready for passkeys!"
  unsupportedMessage="Passkeys not available"
/>
```

### Hooks

#### usePasskey

The main hook for accessing passkey functionality.

```tsx
const {
  isSupported,        // boolean
  isRegistering,      // boolean
  isAuthenticating,   // boolean
  credentials,        // PasskeyCredential[]
  register,           // (options) => Promise<PasskeyCredential>
  authenticate,       // (options?) => Promise<string>
  deleteCredential,   // (id) => Promise<void>
  clearCredentials,   // () => void
} = usePasskey();
```

#### usePasskeySupport

Check if passkeys are supported.

```tsx
const { isSupported, isChecking } = usePasskeySupport();
```

#### usePasskeyRegistration

Hook for passkey registration operations.

```tsx
const { register, isRegistering, error } = usePasskeyRegistration();
```

#### usePasskeyAuthentication

Hook for passkey authentication operations.

```tsx
const { authenticate, isAuthenticating, error } = usePasskeyAuthentication();
```

## Advanced Usage

### Custom Storage Adapter

```tsx
import { PasskeyStorageAdapter, PasskeyProvider } from '@react-passkey/core';

class CustomStorageAdapter implements PasskeyStorageAdapter {
  async getCredentials() { /* ... */ }
  async saveCredential(credential) { /* ... */ }
  async deleteCredential(id) { /* ... */ }
  async clearCredentials() { /* ... */ }
}

// Use with provider
<PasskeyProvider storageAdapter={new CustomStorageAdapter()}>
  {children}
</PasskeyProvider>
```

### Conditional Mediation

```tsx
// For autofill/conditional UI
const credentialId = await authenticate({
  allowCredentials: [], // Empty array triggers conditional UI
  userVerification: 'preferred',
});
```

## Browser Support

- Chrome/Edge 67+
- Firefox 60+
- Safari 14+
- Chrome Android 70+
- Safari iOS 14.5+

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build library
npm run build

# Run example app
cd example
npm install
npm run dev
```

## GitHub Pages Deployment

This library includes automatic GitHub Pages deployment. To set up:

1. **Push to GitHub**: Create a new repository and push your code
2. **Enable GitHub Pages**: 
   - Go to repository Settings → Pages
   - Set source to "GitHub Actions"
3. **Automatic Deployment**: The workflow will automatically deploy on pushes to main branch
4. **Access Demo**: Your demo will be available at `https://yourusername.github.io/react-passkey/`

### Manual Deployment

You can also deploy manually:

```bash
cd example
npm run build
npm run deploy  # Requires gh-pages package
```

## Requirements

- **HTTPS**: Passkeys require secure contexts (HTTPS)
- **Modern Browser**: Chrome 67+, Firefox 60+, Safari 14+, Edge 18+
- **Device Security**: Works best with biometric authentication (Touch ID, Face ID, Windows Hello)

## License

MIT