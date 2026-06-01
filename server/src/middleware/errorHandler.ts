import { Request, Response, NextFunction } from 'express';
import { logger } from '../logger';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  logger.error(err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
}
