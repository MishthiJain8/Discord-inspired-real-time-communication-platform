import { io, Socket } from 'socket.io-client';
import { getStoredTokens } from './api';

let socket: Socket | null = null;

export function createSocket() {
  if (socket) return socket;
  const tokens = getStoredTokens();
  socket = io('/', {
    autoConnect: false,
    auth: {
      accessToken: tokens?.accessToken
    }
  });
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
