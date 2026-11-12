import { describe, it, expect, beforeEach } from 'vitest';
import { cn, formatVND } from '../utils';
import { authStorage } from '../auth';

describe('Utility Functions', () => {
  it('cn() should correctly merge class names and resolve Tailwind conflicts', () => {
    const result = cn('px-4 py-2', 'bg-red-500', { 'text-white': true, 'opacity-50': false });
    expect(result).toContain('px-4');
    expect(result).toContain('py-2');
    expect(result).toContain('bg-red-500');
    expect(result).toContain('text-white');
    expect(result).not.toContain('opacity-50');

    // Conflict resolution
    const conflictResolved = cn('p-4', 'p-2');
    expect(conflictResolved).toBe('p-2');
  });

  it('formatVND() should format numbers into Vietnamese currency style', () => {
    const formatted = formatVND(500000);
    // Should contain 500.000 and currency symbol
    expect(formatted).toContain('500.000');
  });
});

describe('authStorage', () => {
  beforeEach(() => {
    authStorage.clearToken();
  });

  it('should store, retrieve and clear token properly', () => {
    expect(authStorage.getToken()).toBeNull();
    authStorage.setToken('test-access-token');
    expect(authStorage.getToken()).toBe('test-access-token');
    authStorage.clearToken();
    expect(authStorage.getToken()).toBeNull();
  });

  it('should store and retrieve user role', () => {
    expect(authStorage.getUserRole()).toBeNull();
    authStorage.setUser({
      id: 'user-1',
      gymId: 'gym-1',
      email: 'owner@gympilot.vn',
      fullName: 'Chủ phòng',
      role: 'OWNER',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    expect(authStorage.getUserRole()).toBe('OWNER');
  });
});
