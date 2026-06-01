import { createClient } from 'redis';

let redisClient: ReturnType<typeof createClient> | null = null;

export function initRedis(redisUrl: string) {
  if (!redisClient) {
    redisClient = createClient({ url: redisUrl });
  }
  return redisClient;
}

export function getRedisClient() {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call initRedis() first.');
  }
  return redisClient;
}

export async function connectRedis() {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call initRedis() first.');
  }
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

export async function disconnectRedis() {
  if (redisClient && redisClient.isOpen) {
    await redisClient.disconnect();
  }
}
