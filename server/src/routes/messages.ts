import { Router } from 'express';
import { body, query } from 'express-validator';
import { requireAuth, AuthRequest } from '../middleware/authMiddleware';
import { fetchMessageHistory, postMessage } from '../services/messageService';
import { getChannel } from '../services/serverService';
import { isServerMember } from '../repositories/serverRepository';
import createError from 'http-errors';

const router = Router();

router.get(
  '/:channelId/messages',
  requireAuth,
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  async (req: AuthRequest, res, next) => {
    try {
      const { channelId } = req.params;
      const page = Number(req.query.page ?? '1');
      const limit = Number(req.query.limit ?? '50');
      const channel = await getChannel(channelId);
      const member = await isServerMember(channel.serverId, req.user!.userId);
      if (!member) {
        throw new createError.Forbidden('Cannot view messages for channel');
      }
      const messages = await fetchMessageHistory(channelId, page, limit);
      res.json({ messages });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/:channelId/messages',
  requireAuth,
  body('content').isString().isLength({ min: 1 }),
  async (req: AuthRequest, res, next) => {
    try {
      const { channelId } = req.params;
      const { content } = req.body;
      const channel = await getChannel(channelId);
      const member = await isServerMember(channel.serverId, req.user!.userId);
      if (!member) {
        throw new createError.Forbidden('Cannot send message to channel');
      }
      const message = await postMessage(channelId, req.user!.userId, content);
      res.status(201).json({ message });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
