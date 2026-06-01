import 'dotenv/config';

import http from 'http';
import app from './app';
import { initConfig } from './config';
import { connectRedis, initRedis } from './redis';
import { initPool } from './db';
import { setupSocket } from './socket';
import { logger } from './logger';

const server = http.createServer(app);

async function start() {
  try {
    const config = initConfig();
    
    initPool(config.databaseUrl);
    initRedis(config.redisUrl);
    
    await connectRedis();
    await setupSocket(server);
    server.listen(config.port, () => {
      logger.info(`Server listening on port ${config.port}`);
    });
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
}

start().catch(err => {
  logger.error(err);
  process.exit(1);
});

process.on('SIGINT', () => {
  logger.info('Shutting down gracefully');
  process.exit(0);
});
