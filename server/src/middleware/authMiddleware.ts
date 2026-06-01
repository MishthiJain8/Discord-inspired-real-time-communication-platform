import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { verifyAccessToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: { userId: string; email: string };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new createError.Unauthorized('Authorization token missing'));
  }

  try {
    const token = header.substring(7);
    req.user = verifyAccessToken(token);
    next();
  } catch (err) {
    next(new createError.Unauthorized('Invalid or expired token'));
  }
}
