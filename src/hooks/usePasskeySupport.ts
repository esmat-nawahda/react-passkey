import { useEffect, useState } from 'react';
import { isPasskeySupported } from '../utils/passkey-utils';

export const usePasskeySupport = () => {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkSupport = async () => {
      try {
        const supported = await isPasskeySupported();
        setIsSupported(supported);
      } catch {
        setIsSupported(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkSupport();
  }, []);

  return { isSupported, isChecking };
};