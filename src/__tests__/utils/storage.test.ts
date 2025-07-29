import { LocalStorageAdapter, MemoryStorageAdapter } from '../../utils/storage';
import type { PasskeyCredential } from '../../types';

const mockCredential: PasskeyCredential = {
  id: 'test-id',
  publicKey: 'test-public-key',
  userId: 'test-user',
  createdAt: new Date('2024-01-01'),
  transports: ['internal'],
};

describe('LocalStorageAdapter', () => {
  let adapter: LocalStorageAdapter;

  beforeEach(() => {
    localStorage.clear();
    adapter = new LocalStorageAdapter('test-key');
  });

  it('should start with empty credentials', async () => {
    const credentials = await adapter.getCredentials();
    expect(credentials).toEqual([]);
  });

  it('should save and retrieve credentials', async () => {
    await adapter.saveCredential(mockCredential);
    const credentials = await adapter.getCredentials();
    
    expect(credentials).toHaveLength(1);
    expect(credentials[0]).toMatchObject({
      id: mockCredential.id,
      publicKey: mockCredential.publicKey,
      userId: mockCredential.userId,
    });
  });

  it('should update existing credential', async () => {
    await adapter.saveCredential(mockCredential);
    
    const updated = { ...mockCredential, lastUsed: new Date('2024-01-02') };
    await adapter.saveCredential(updated);
    
    const credentials = await adapter.getCredentials();
    expect(credentials).toHaveLength(1);
    expect(credentials[0].lastUsed).toEqual(new Date('2024-01-02'));
  });

  it('should delete credential', async () => {
    await adapter.saveCredential(mockCredential);
    await adapter.deleteCredential(mockCredential.id);
    
    const credentials = await adapter.getCredentials();
    expect(credentials).toHaveLength(0);
  });

  it('should clear all credentials', async () => {
    await adapter.saveCredential(mockCredential);
    await adapter.saveCredential({ ...mockCredential, id: 'test-id-2' });
    
    await adapter.clearCredentials();
    
    const credentials = await adapter.getCredentials();
    expect(credentials).toHaveLength(0);
  });

  it('should handle corrupted storage gracefully', async () => {
    localStorage.setItem('test-key', 'invalid-json');
    
    const credentials = await adapter.getCredentials();
    expect(credentials).toEqual([]);
  });
});

describe('MemoryStorageAdapter', () => {
  let adapter: MemoryStorageAdapter;

  beforeEach(() => {
    adapter = new MemoryStorageAdapter();
  });

  it('should start with empty credentials', async () => {
    const credentials = await adapter.getCredentials();
    expect(credentials).toEqual([]);
  });

  it('should save and retrieve credentials', async () => {
    await adapter.saveCredential(mockCredential);
    const credentials = await adapter.getCredentials();
    
    expect(credentials).toHaveLength(1);
    expect(credentials[0]).toEqual(mockCredential);
  });

  it('should update existing credential', async () => {
    await adapter.saveCredential(mockCredential);
    
    const updated = { ...mockCredential, lastUsed: new Date() };
    await adapter.saveCredential(updated);
    
    const credentials = await adapter.getCredentials();
    expect(credentials).toHaveLength(1);
    expect(credentials[0].lastUsed).toBeDefined();
  });

  it('should delete credential', async () => {
    await adapter.saveCredential(mockCredential);
    await adapter.deleteCredential(mockCredential.id);
    
    const credentials = await adapter.getCredentials();
    expect(credentials).toHaveLength(0);
  });

  it('should clear all credentials', async () => {
    await adapter.saveCredential(mockCredential);
    await adapter.saveCredential({ ...mockCredential, id: 'test-id-2' });
    
    await adapter.clearCredentials();
    
    const credentials = await adapter.getCredentials();
    expect(credentials).toHaveLength(0);
  });

  it('should return a copy of credentials array', async () => {
    await adapter.saveCredential(mockCredential);
    
    const credentials1 = await adapter.getCredentials();
    const credentials2 = await adapter.getCredentials();
    
    expect(credentials1).not.toBe(credentials2);
    expect(credentials1).toEqual(credentials2);
  });
});