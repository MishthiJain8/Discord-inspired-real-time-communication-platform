import { findUserById, updateUserProfile, setUserStatus } from '../repositories/userRepository';
import createError from 'http-errors';

export async function getCurrentUser(userId: string) {
  const user = await findUserById(userId);
  if (!user) {
    throw new createError.NotFound('User not found');
  }
  return user;
}

export async function updateProfile(userId: string, username?: string, avatarUrl?: string) {
  return updateUserProfile(userId, username, avatarUrl);
}

export async function setPresence(userId: string, status: 'online' | 'offline') {
  await setUserStatus(userId, status);
}
