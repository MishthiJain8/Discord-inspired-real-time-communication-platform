import * as jwt from 'jsonwebtoken';
import { getActiveConfig } from '../config';
import { JwtPayload } from '../types';

function getAccessSecret(): jwt.Secret {
  const config = getActiveConfig();
  if (!config.jwt?.accessSecret) {
    throw new Error('JWT_ACCESS_SECRET not configured');
  }
  return config.jwt.accessSecret;
}

function getRefreshSecret(): jwt.Secret {
  const config = getActiveConfig();
  if (!config.jwt?.refreshSecret) {
    throw new Error('JWT_REFRESH_SECRET not configured');
  }
  return config.jwt.refreshSecret;
}

export function signAccessToken(payload: JwtPayload) {
  const config = getActiveConfig();
  return jwt.sign(payload as jwt.JwtPayload, getAccessSecret(), {
    expiresIn: config.jwt.accessExpiresIn as jwt.SignOptions['expiresIn']
  });
}

export function signRefreshToken(payload: JwtPayload) {
  const config = getActiveConfig();
  return jwt.sign(payload as jwt.JwtPayload, getRefreshSecret(), {
    expiresIn: config.jwt.refreshExpiresIn as jwt.SignOptions['expiresIn']
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, getAccessSecret()) as JwtPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, getRefreshSecret()) as JwtPayload;
}
