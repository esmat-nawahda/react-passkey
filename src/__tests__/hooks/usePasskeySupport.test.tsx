import { renderHook, waitFor } from '@testing-library/react';
import { usePasskeySupport } from '../../hooks/usePasskeySupport';

describe('usePasskeySupport', () => {
  it('should detect passkey support', async () => {
    const { result } = renderHook(() => usePasskeySupport());

    expect(result.current.isChecking).toBe(true);
    expect(result.current.isSupported).toBe(null);

    await waitFor(() => {
      expect(result.current.isChecking).toBe(false);
    });

    expect(result.current.isSupported).toBe(true);
  });

  it('should handle missing PublicKeyCredential', async () => {
    const original = window.PublicKeyCredential;
    (window as any).PublicKeyCredential = undefined;

    const { result } = renderHook(() => usePasskeySupport());

    await waitFor(() => {
      expect(result.current.isChecking).toBe(false);
    });

    expect(result.current.isSupported).toBe(false);

    (window as any).PublicKeyCredential = original;
  });

  it('should handle errors gracefully', async () => {
    const original = window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable;
    window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable = jest
      .fn()
      .mockRejectedValue(new Error('Test error'));

    const { result } = renderHook(() => usePasskeySupport());

    await waitFor(() => {
      expect(result.current.isChecking).toBe(false);
    });

    expect(result.current.isSupported).toBe(false);

    window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable = original;
  });
});