import { Pool, QueryResultRow } from 'pg';

let pool: Pool | null = null;

export function initPool(databaseUrl: string) {
  if (!pool) {
    pool = new Pool({ connectionString: databaseUrl });
  }
  return pool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(text: string, params?: unknown[]) {
  if (!pool) {
    throw new Error('Database pool not initialized. Call initPool() first.');
  }
  const result = await pool.query<T>(text, params);
  return result;
}
