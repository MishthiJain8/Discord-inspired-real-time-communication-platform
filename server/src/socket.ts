import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { config } from './config';
import { verifyAccessToken } from './utils/jwt';
import { setPresence } from './services/userService';
import { getChannel } from './services/serverService';
import { postMessage } from './services/messageService';
import { logger } from './logger';
import { getRedisClient } from './redis';

export async function setupSocket(server: HttpServer) {
  const io = new Server(server, {
    cors: {
      origin: config.clientUrl,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  const pubClient = getRedisClient();
  const subClient = pubClient.duplicate();
  await subClient.connect();
  io.adapter(createAdapter(pubClient, subClient));

  io.use((socket, next) => {
    const token = socket.handshake.auth?.accessToken || socket.handshake.query?.accessToken;
    if (!token || typeof token !== 'string') {
      return next(new Error('Authentication token required'));
    }

    try {
      const payload = verifyAccessToken(token);
      socket.data.user = payload;
      return next();
    } catch (err) {
      return next(new Error('Invalid authorization token'));
    }
  });

  io.on('connection', async (socket: Socket) => {
    const user = socket.data.user;
    if (!user) {
      socket.disconnect(true);
      return;
    }

    await setPresence(user.userId, 'online');
    socket.broadcast.emit('user_online', { userId: user.userId });

    socket.on('join_channel', async ({ channelId }) => {
      try {
        const channel = await getChannel(channelId);
        await socket.join(channelId);
        const activeCount = (await io.in(channelId).allSockets()).size;
        io.to(channelId).emit('presence_update', { channelId, activeCount });
      } catch (err) {
        logger.error(err);
      }
    });

    socket.on('leave_channel', async ({ channelId }) => {
      await socket.leave(channelId);
      const activeCount = (await io.in(channelId).allSockets()).size;
      io.to(channelId).emit('presence_update', { channelId, activeCount });
    });

    socket.on('typing', ({ channelId, isTyping }) => {
      socket.to(channelId).emit('channel_typing', {
        channelId,
        userId: user.userId,
        username: user.email,
        isTyping
      });
    });

    socket.on('send_message', async ({ channelId, content }) => {
      try {
        const message = await postMessage(channelId, user.userId, content);
        io.to(channelId).emit('message_created', message);
      } catch (err) {
        logger.error(err);
      }
    });

    socket.on('disconnect', async () => {
      await setPresence(user.userId, 'offline');
      socket.broadcast.emit('user_offline', { userId: user.userId });
    });
  });

  return io;
}
