import { Router } from 'express';
import { body } from 'express-validator';
import { requireAuth, AuthRequest } from '../middleware/authMiddleware';
import { getCurrentUser, updateProfile } from '../services/userService';
import createError from 'http-errors';

const router = Router();

router.get('/me', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const user = await getCurrentUser(req.user!.userId);
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

router.patch(
  '/me',
  requireAuth,
  body('username').optional().isString().isLength({ min: 3 }),
  body('avatarUrl').optional().isString().isURL(),
  async (req: AuthRequest, res, next) => {
    try {
      const { username, avatarUrl } = req.body;
      const user = await updateProfile(req.user!.userId, username, avatarUrl);
      res.json({ user });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
