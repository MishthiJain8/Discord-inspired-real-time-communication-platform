import { findUserByEmail, createUser, findUserById } from '../repositories/userRepository';
import { createRole, createMembership } from '../repositories/serverRepository';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { hashPassword, verifyPassword } from '../utils/password';
import { getRedisClient } from '../redis';
import createError from 'http-errors';
import { JwtPayload, User } from '../types';

const REFRESH_TOKEN_PREFIX = 'refresh_token:';

async function saveRefreshToken(token: string, userId: string) {
  const redisClient = getRedisClient();
  await redisClient.set(REFRESH_TOKEN_PREFIX + token, userId, { EX: 7 * 24 * 60 * 60 });
}

async function revokeRefreshToken(token: string) {
  const redisClient = getRedisClient();
  await redisClient.del(REFRESH_TOKEN_PREFIX + token);
}

async function validateRefreshToken(token: string) {
  const redisClient = getRedisClient();
  const userId = await redisClient.get(REFRESH_TOKEN_PREFIX + token);
  if (!userId) {
    throw new createError.Unauthorized('Refresh token expired or revoked');
  }
  return userId;
}

export async function registerUser(username: string, email: string, password: string) {
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new createError.Conflict('Email already in use');
  }
  const passwordHash = await hashPassword(password);
  return createUser(username, email, passwordHash);
}

export async function loginUser(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new createError.Unauthorized('Invalid credentials');
  }
  const isValid = await verifyPassword(password, user.password_hash);
  if (!isValid) {
    throw new createError.Unauthorized('Invalid credentials');
  }

  const payload: JwtPayload = { userId: user.id, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  await saveRefreshToken(refreshToken, user.id);

  return { accessToken, refreshToken, user: { id: user.id, username: user.username, email: user.email, avatarUrl: user.avatarUrl } };
}

export async function refreshAuthToken(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);
  await validateRefreshToken(refreshToken);
  await revokeRefreshToken(refreshToken);

  const nextToken = signRefreshToken({ userId: payload.userId, email: payload.email });
  await saveRefreshToken(nextToken, payload.userId);
  const accessToken = signAccessToken({ userId: payload.userId, email: payload.email });

  return { accessToken, refreshToken: nextToken };
}

export async function logoutUser(refreshToken: string) {
  await revokeRefreshToken(refreshToken);
}
