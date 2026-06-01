import { query } from '../db';
import { ServerRoom } from '../types';

export async function createServer(name: string, description: string | null, isPrivate: boolean, ownerId: string) {
  const result = await query<ServerRoom>(
    `INSERT INTO servers (name, description, is_private, owner_id) VALUES ($1, $2, $3, $4) RETURNING id, name, description, is_private AS "isPrivate", owner_id AS "ownerId"`,
    [name, description, isPrivate, ownerId]
  );
  return result.rows[0];
}

export async function getServersForUser(userId: string) {
  const result = await query<ServerRoom>(
    `SELECT s.id, s.name, s.description, s.is_private AS "isPrivate", s.owner_id AS "ownerId"
     FROM servers s
     JOIN memberships m ON m.server_id = s.id
     WHERE m.user_id = $1`,
    [userId]
  );
  return result.rows;
}

export async function findServerById(serverId: string) {
  const result = await query<ServerRoom>(
    `SELECT id, name, description, is_private AS "isPrivate", owner_id AS "ownerId" FROM servers WHERE id = $1`,
    [serverId]
  );
  return result.rows[0];
}

export async function createMembership(serverId: string, userId: string, roleId: string) {
  await query(
    `INSERT INTO memberships (server_id, user_id, role_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
    [serverId, userId, roleId]
  );
}

export async function isServerMember(serverId: string, userId: string) {
  const result = await query(
    `SELECT 1 FROM memberships WHERE server_id = $1 AND user_id = $2 LIMIT 1`,
    [serverId, userId]
  );
  return Boolean(result.rowCount && result.rowCount > 0);
}

export async function createRole(serverId: string, name: string, permissions: object) {
  const result = await query(
    `INSERT INTO roles (server_id, name, permissions) VALUES ($1, $2, $3) RETURNING id`,
    [serverId, name, permissions]
  );
  const row = result.rows[0] as { id: string };
  return row.id;
}
