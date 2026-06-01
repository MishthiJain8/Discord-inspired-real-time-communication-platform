import { query } from '../db';
import { Channel } from '../types';

export async function createChannel(serverId: string, name: string, type: 'public' | 'private', createdBy: string) {
  const result = await query<Channel>(
    `INSERT INTO channels (server_id, name, type, created_by) VALUES ($1, $2, $3, $4) RETURNING id, server_id AS "serverId", name, type, created_by AS "createdBy", created_at AS "createdAt"`,
    [serverId, name, type, createdBy]
  );
  return result.rows[0];
}

export async function getChannelsByServer(serverId: string) {
  const result = await query<Channel>(
    `SELECT id, server_id AS "serverId", name, type, created_by AS "createdBy", created_at AS "createdAt" FROM channels WHERE server_id = $1 ORDER BY created_at`,
    [serverId]
  );
  return result.rows;
}

export async function findChannelById(channelId: string) {
  const result = await query<Channel>(
    `SELECT id, server_id AS "serverId", name, type, created_by AS "createdBy", created_at AS "createdAt" FROM channels WHERE id = $1`,
    [channelId]
  );
  return result.rows[0];
}
