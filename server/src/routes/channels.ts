import { Router } from 'express';
import { body } from 'express-validator';
import { requireAuth, AuthRequest } from '../middleware/authMiddleware';
import { createServerChannel, listServerChannels, getChannel } from '../services/serverService';
import { isServerMember } from '../repositories/serverRepository';
import createError from 'http-errors';

const router = Router();

router.post(
  '/:serverId/channels',
  requireAuth,
  body('name').isString().isLength({ min: 2 }),
  body('type').isIn(['public', 'private']),
  async (req: AuthRequest, res, next) => {
    try {
      const { serverId } = req.params;
      const { name, type } = req.body;
      const member = await isServerMember(serverId, req.user!.userId);
      if (!member) {
        throw new createError.Forbidden('You must be a server member to create channels');
      }
      const channel = await createServerChannel(serverId, name, type, req.user!.userId);
      res.status(201).json({ channel });
    } catch (err) {
      next(err);
    }
  }
);

router.get('/:serverId/channels', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const { serverId } = req.params;
    const member = await isServerMember(serverId, req.user!.userId);
    if (!member) {
      throw new createError.Forbidden('Must join server to view channels');
    }
    const channels = await listServerChannels(serverId);
    res.json({ channels });
  } catch (err) {
    next(err);
  }
});

router.post('/channel/:channelId/join', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const channel = await getChannel(req.params.channelId);
    const member = await isServerMember(channel.serverId, req.user!.userId);
    if (!member) {
      throw new createError.Forbidden('Join the server before joining a channel');
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

router.post('/channel/:channelId/leave', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const channel = await getChannel(req.params.channelId);
    const member = await isServerMember(channel.serverId, req.user!.userId);
    if (!member) {
      throw new createError.Forbidden('Cannot leave a channel when not a member');
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

router.get('/channel/:channelId', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const channel = await getChannel(req.params.channelId);
    res.json({ channel });
  } catch (err) {
    next(err);
  }
});

export default router;
