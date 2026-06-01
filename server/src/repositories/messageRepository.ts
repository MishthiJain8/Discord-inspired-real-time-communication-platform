import { query } from '../db';
import { Message } from '../types';

export async function createMessage(channelId: string, authorId: string, content: string) {
  const result = await query<Message>(
    `INSERT INTO messages (channel_id, author_id, content) VALUES ($1, $2, $3) RETURNING id, channel_id AS "channelId", author_id AS "authorId", content, created_at AS "createdAt", updated_at AS "updatedAt"`,
    [channelId, authorId, content]
  );
  return result.rows[0];
}

export async function getMessages(channelId: string, limit: number, offset: number) {
  const result = await query<Message>(
    `SELECT id, channel_id AS "channelId", author_id AS "authorId", content, created_at AS "createdAt", updated_at AS "updatedAt" FROM messages WHERE channel_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
    [channelId, limit, offset]
  );
  return result.rows;
}
