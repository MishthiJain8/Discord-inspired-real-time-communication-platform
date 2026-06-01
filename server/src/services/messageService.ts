import { createMessage, getMessages } from '../repositories/messageRepository';
import { findChannelById } from '../repositories/channelRepository';
import createError from 'http-errors';

export async function postMessage(channelId: string, authorId: string, content: string) {
  const channel = await findChannelById(channelId);
  if (!channel) {
    throw new createError.NotFound('Channel not found');
  }
  return createMessage(channelId, authorId, content);
}

export async function fetchMessageHistory(channelId: string, page = 1, limit = 50) {
  const offset = (page - 1) * limit;
  return getMessages(channelId, limit, offset);
}
