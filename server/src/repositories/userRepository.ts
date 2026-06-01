import { query } from '../db';
import { User } from '../types';

export async function createUser(username: string, email: string, passwordHash: string) {
  const result = await query<User>(
    `INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, avatar_url AS "avatarUrl", status, last_seen AS "lastSeen", created_at AS "createdAt"`,
    [username, email, passwordHash]
  );
  return result.rows[0];
}

export async function findUserByEmail(email: string) {
  const result = await query<User & { password_hash: string }>(
    `SELECT *, avatar_url AS "avatarUrl", last_seen AS "lastSeen", created_at AS "createdAt" FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0];
}

export async function findUserById(id: string) {
  const result = await query<User>(
    `SELECT id, username, email, avatar_url AS "avatarUrl", status, last_seen AS "lastSeen", created_at AS "createdAt" FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0];
}

export async function updateUserProfile(id: string, username?: string, avatarUrl?: string) {
  const result = await query<User>(
    `UPDATE users SET username = COALESCE($1, username), avatar_url = COALESCE($2, avatar_url) WHERE id = $3 RETURNING id, username, email, avatar_url AS "avatarUrl", status, last_seen AS "lastSeen", created_at AS "createdAt"`,
    [username, avatarUrl, id]
  );
  return result.rows[0];
}

export async function setUserStatus(id: string, status: 'online' | 'offline') {
  await query(`UPDATE users SET status = $1, last_seen = NOW() WHERE id = $2`, [status, id]);
}
