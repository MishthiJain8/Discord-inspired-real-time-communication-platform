const required = [
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'DATABASE_URL',
  'REDIS_URL',
  'CLIENT_URL'
];

function validateEnv() {
  for (const name of required) {
    if (!process.env[name]) {
      throw new Error(`Missing required environment variable ${name}`);
    }
  }
}

export function getConfig() {
  validateEnv();
  return {
    port: Number(process.env.PORT ?? 4000),
    env: process.env.NODE_ENV ?? 'development',
    jwt: {
      accessSecret: process.env.JWT_ACCESS_SECRET!,
      refreshSecret: process.env.JWT_REFRESH_SECRET!,
      accessExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN ?? '15m',
      refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN ?? '7d'
    },
    databaseUrl: process.env.DATABASE_URL!,
    redisUrl: process.env.REDIS_URL!,
    clientUrl: process.env.CLIENT_URL!
  };
}

let cachedConfig: ReturnType<typeof getConfig> | null = null;

export function initConfig(): ReturnType<typeof getConfig> {
  if (!cachedConfig) {
    cachedConfig = getConfig();
  }
  return cachedConfig;
}

export function getActiveConfig(): ReturnType<typeof getConfig> {
  if (!cachedConfig) {
    throw new Error('Config not initialized. Call initConfig() first.');
  }
  return cachedConfig;
}

export const config = new Proxy({} as ReturnType<typeof getConfig>, {
  get: (target, prop) => {
    if (!cachedConfig) {
      throw new Error('Config not initialized. Call initConfig() first.');
    }
    return cachedConfig[prop as keyof typeof cachedConfig];
  }
});
