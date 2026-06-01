import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from '../utils/password';

describe('password utilities', () => {
  it('hashes and verifies a password correctly', async () => {
    const password = 'StrongPass123!';
    const hash = await hashPassword(password);
    expect(hash).toBeTypeOf('string');
    const valid = await verifyPassword(password, hash);
    expect(valid).toBe(true);
    const invalid = await verifyPassword('WrongPassword', hash);
    expect(invalid).toBe(false);
  });
});
