import type { PasskeyCredential, PasskeyStorageAdapter } from '../types';

export class LocalStorageAdapter implements PasskeyStorageAdapter {
  constructor(private storageKey: string = 'react-passkey-credentials') {}

  async getCredentials(): Promise<PasskeyCredential[]> {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return [];
      
      const credentials = JSON.parse(stored);
      return credentials.map((cred: any) => ({
        ...cred,
        createdAt: new Date(cred.createdAt),
        lastUsed: cred.lastUsed ? new Date(cred.lastUsed) : undefined,
      }));
    } catch {
      return [];
    }
  }

  async saveCredential(credential: PasskeyCredential): Promise<void> {
    const credentials = await this.getCredentials();
    const existingIndex = credentials.findIndex((c) => c.id === credential.id);

    if (existingIndex >= 0) {
      credentials[existingIndex] = credential;
    } else {
      credentials.push(credential);
    }

    localStorage.setItem(this.storageKey, JSON.stringify(credentials));
  }

  async deleteCredential(credentialId: string): Promise<void> {
    const credentials = await this.getCredentials();
    const filtered = credentials.filter((c) => c.id !== credentialId);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
  }

  async clearCredentials(): Promise<void> {
    localStorage.removeItem(this.storageKey);
  }
}

export class MemoryStorageAdapter implements PasskeyStorageAdapter {
  private credentials: PasskeyCredential[] = [];

  async getCredentials(): Promise<PasskeyCredential[]> {
    return [...this.credentials];
  }

  async saveCredential(credential: PasskeyCredential): Promise<void> {
    const existingIndex = this.credentials.findIndex((c) => c.id === credential.id);

    if (existingIndex >= 0) {
      this.credentials[existingIndex] = credential;
    } else {
      this.credentials.push(credential);
    }
  }

  async deleteCredential(credentialId: string): Promise<void> {
    this.credentials = this.credentials.filter((c) => c.id !== credentialId);
  }

  async clearCredentials(): Promise<void> {
    this.credentials = [];
  }
}