export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  status: 'online' | 'offline';
  lastSeen: string;
  createdAt: string;
}

export interface ServerRoom {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  ownerId: string;
}

export interface Channel {
  id: string;
  serverId: string;
  name: string;
  type: 'public' | 'private';
  createdBy: string;
  createdAt: string;
}

export interface Message {
  id: string;
  channelId: string;
  authorId: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
}
