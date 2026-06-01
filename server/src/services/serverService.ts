import { createServer, createRole, createMembership, getServersForUser, findServerById, isServerMember } from '../repositories/serverRepository';
import { createChannel, getChannelsByServer, findChannelById } from '../repositories/channelRepository';
import createError from 'http-errors';

const defaultPermissions = { manageChannels: true, sendMessages: true, manageMembers: true };

export async function createWorkspace(name: string, description: string | null, isPrivate: boolean, ownerId: string) {
  const server = await createServer(name, description, isPrivate, ownerId);
  const roleId = await createRole(server.id, 'Owner', defaultPermissions);
  await createMembership(server.id, ownerId, roleId);
  return server;
}

export async function listUserServers(userId: string) {
  return getServersForUser(userId);
}

export async function getServer(serverId: string) {
  const server = await findServerById(serverId);
  if (!server) {
    throw new createError.NotFound('Server not found');
  }
  return server;
}

export async function inviteToChannel(serverId: string, userId: string) {
  const member = await isServerMember(serverId, userId);
  if (!member) {
    throw new createError.Forbidden('User does not have access to the server');
  }
  return member;
}

export async function createServerChannel(serverId: string, name: string, type: 'public' | 'private', createdBy: string) {
  const server = await findServerById(serverId);
  if (!server) {
    throw new createError.NotFound('Server not found');
  }
  return createChannel(serverId, name, type, createdBy);
}

export async function listServerChannels(serverId: string) {
  return getChannelsByServer(serverId);
}

export async function getChannel(channelId: string) {
  const channel = await findChannelById(channelId);
  if (!channel) {
    throw new createError.NotFound('Channel not found');
  }
  return channel;
}
