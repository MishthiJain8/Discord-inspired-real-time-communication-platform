import { Router } from 'express';
import { body } from 'express-validator';
import { requireAuth, AuthRequest } from '../middleware/authMiddleware';
import { createWorkspace, listUserServers, getServer } from '../services/serverService';
import createError from 'http-errors';

const router = Router();

router.post(
  '/',
  requireAuth,
  body('name').isString().isLength({ min: 3 }),
  body('description').optional().isString(),
  body('isPrivate').optional().isBoolean(),
  async (req: AuthRequest, res, next) => {
    try {
      const { name, description, isPrivate = false } = req.body;
      const server = await createWorkspace(name, description ?? null, isPrivate, req.user!.userId);
      res.status(201).json({ server });
    } catch (err) {
      next(err);
    }
  }
);

router.get('/', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const servers = await listUserServers(req.user!.userId);
    res.json({ servers });
  } catch (err) {
    next(err);
  }
});

router.get('/:serverId', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const server = await getServer(req.params.serverId);
    res.json({ server });
  } catch (err) {
    next(err);
  }
});

export default router;
