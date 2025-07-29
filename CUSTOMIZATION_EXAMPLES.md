# 🎨 PasskeyButton Customization Examples

## 📋 **All Available Props**

```tsx
interface PasskeyButtonProps {
  mode: 'register' | 'authenticate';
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'minimal';
  size?: 'small' | 'medium' | 'large';
  registrationOptions?: PasskeyRegistrationOptions;
  authenticationOptions?: PasskeyAuthenticationOptions;
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
}
```

## 🎯 **Built-in Variants**

### **Primary Buttons**
```tsx
// Blue primary button
<PasskeyButton 
  mode="register" 
  variant="primary"
  size="large"
>
  🔐 Create Account
</PasskeyButton>

// Green success variant
<PasskeyButton 
  mode="authenticate" 
  variant="primary"
  style={{ backgroundColor: '#28a745' }}
>
  ✅ Sign In Securely
</PasskeyButton>
```

### **Outline Buttons**
```tsx
// Blue outline
<PasskeyButton 
  mode="register" 
  variant="outline"
>
  📱 Register with Biometrics
</PasskeyButton>

// Custom color outline
<PasskeyButton 
  mode="authenticate" 
  variant="outline"
  style={{ 
    borderColor: '#dc3545', 
    color: '#dc3545' 
  }}
>
  🔑 Touch ID Sign In
</PasskeyButton>
```

### **Minimal Buttons**
```tsx
// Text-only button
<PasskeyButton 
  mode="authenticate" 
  variant="minimal"
>
  Sign in with passkey →
</PasskeyButton>

// Icon + text minimal
<PasskeyButton 
  mode="register" 
  variant="minimal"
  size="small"
>
  <span>👆 Add fingerprint</span>
</PasskeyButton>
```

## 📏 **Different Sizes**

```tsx
// Small button
<PasskeyButton 
  mode="authenticate" 
  variant="primary" 
  size="small"
>
  Quick Sign In
</PasskeyButton>

// Medium (default)
<PasskeyButton 
  mode="register" 
  variant="secondary" 
  size="medium"
>
  Register Passkey
</PasskeyButton>

// Large button
<PasskeyButton 
  mode="authenticate" 
  variant="outline" 
  size="large"
>
  🔐 Sign In with Touch ID
</PasskeyButton>
```

## 🎨 **Custom Styling**

### **CSS Classes**
```tsx
// Using CSS modules or styled-components
<PasskeyButton 
  mode="register"
  className="my-custom-passkey-btn"
>
  Custom Styled Button
</PasskeyButton>
```

```css
/* Custom CSS */
.my-custom-passkey-btn {
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 25px;
  padding: 15px 30px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  transition: transform 0.2s ease;
}

.my-custom-passkey-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.3);
}
```

### **Inline Styles**
```tsx
// Fully custom inline styles
<PasskeyButton 
  mode="authenticate"
  style={{
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: '50px',
    padding: '16px 32px',
    fontSize: '18px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
    border: 'none',
  }}
>
  🚀 Futuristic Sign In
</PasskeyButton>
```

## 🎭 **Custom Content & Icons**

### **With Icons**
```tsx
// Using emoji icons
<PasskeyButton mode="register" variant="primary">
  <span>👆 Add Fingerprint</span>
</PasskeyButton>

<PasskeyButton mode="authenticate" variant="outline">
  <span>📱 Face ID Sign In</span>
</PasskeyButton>

// Using SVG icons
<PasskeyButton mode="register" variant="secondary">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z"/>
  </svg>
  <span>Secure Registration</span>
</PasskeyButton>
```

### **Loading States**
```tsx
function CustomPasskeyButton() {
  const { isRegistering } = usePasskey();
  
  return (
    <PasskeyButton 
      mode="register" 
      variant="primary"
      registrationOptions={{ user: { /* ... */ } }}
    >
      {isRegistering ? (
        <>
          <span className="spinner">⏳</span>
          Creating your passkey...
        </>
      ) : (
        <>
          🔐 Register with Biometrics
        </>
      )}
    </PasskeyButton>
  );
}
```

## 🎨 **Theme-based Variants**

### **Dark Theme**
```tsx
<PasskeyButton 
  mode="authenticate"
  style={{
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    border: '1px solid #333',
    borderRadius: '8px',
  }}
>
  🌙 Dark Mode Sign In
</PasskeyButton>
```

### **Light Theme**
```tsx
<PasskeyButton 
  mode="register"
  style={{
    backgroundColor: '#ffffff',
    color: '#333333',
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  }}
>
  ☀️ Light Mode Register
</PasskeyButton>
```

### **Glass Morphism**
```tsx
<PasskeyButton 
  mode="authenticate"
  style={{
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '16px',
    color: 'white',
  }}
>
  ✨ Glass Effect Sign In
</PasskeyButton>
```

## 📱 **Platform-Specific Styling**

### **iOS Style**
```tsx
<PasskeyButton 
  mode="authenticate"
  style={{
    backgroundColor: '#007AFF',
    color: 'white',
    borderRadius: '12px',
    padding: '16px 24px',
    fontSize: '17px',
    fontWeight: '600',
    border: 'none',
  }}
>
  Sign in with Touch ID
</PasskeyButton>
```

### **Android Material Design**
```tsx
<PasskeyButton 
  mode="register"
  style={{
    backgroundColor: '#6200EA',
    color: 'white',
    borderRadius: '4px',
    padding: '14px 24px',
    fontSize: '14px',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    elevation: 4,
    boxShadow: '0 4px 8px rgba(98, 0, 234, 0.3)',
  }}
>
  REGISTER FINGERPRINT
</PasskeyButton>
```

## 🎯 **Complete Example**

```tsx
import { PasskeyButton, PasskeyProvider } from 'react-passkey-pro';

function MyApp() {
  const handleSuccess = (result) => {
    console.log('Passkey success:', result);
  };

  const handleError = (error) => {
    console.error('Passkey error:', error);
  };

  return (
    <PasskeyProvider>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {/* Default button */}
        <PasskeyButton 
          mode="register"
          variant="default"
          registrationOptions={{
            user: { id: 'user@example.com', name: 'user@example.com', displayName: 'John Doe' }
          }}
          onSuccess={handleSuccess}
          onError={handleError}
        />

        {/* Primary large button */}
        <PasskeyButton 
          mode="authenticate"
          variant="primary"
          size="large"
          onSuccess={handleSuccess}
          onError={handleError}
        >
          🔐 Sign In Securely
        </PasskeyButton>

        {/* Custom styled button */}
        <PasskeyButton 
          mode="register"
          className="gradient-button"
          style={{
            background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
            color: 'white',
            borderRadius: '25px',
            fontWeight: 'bold',
          }}
          registrationOptions={{
            user: { id: 'user@example.com', name: 'user@example.com', displayName: 'Jane Doe' }
          }}
          onSuccess={handleSuccess}
          onError={handleError}
        >
          ✨ Custom Gradient
        </PasskeyButton>
      </div>
    </PasskeyProvider>
  );
}
```

## 🔧 **Pro Tips**

1. **Combine variants with custom styles** for maximum flexibility
2. **Use CSS variables** for consistent theming across your app
3. **Test on different devices** to ensure biometric icons make sense
4. **Provide fallback text** for screen readers
5. **Use loading states** to give users feedback during authentication
6. **Consider platform conventions** (iOS vs Android styling)

The PasskeyButton is designed to be completely flexible while providing sensible defaults! 🎨✨