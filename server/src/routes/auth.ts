import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { loginUser, registerUser, refreshAuthToken, logoutUser } from '../services/authService';
import createError from 'http-errors';

const router = Router();

router.post(
  '/register',
  body('username').isLength({ min: 3 }),
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError.BadRequest('Invalid registration payload'));
    }

    const { username, email, password } = req.body;
    try {
      const user = await registerUser(username, email, password);
      res.status(201).json({ user });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/login',
  body('email').isEmail(),
  body('password').isString(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError.BadRequest('Invalid login payload'));
    }

    try {
      const { email, password } = req.body;
      const tokens = await loginUser(email, password);
      res.json(tokens);
    } catch (err) {
      next(err);
    }
  }
);

router.post('/refresh', body('refreshToken').isString(), async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const tokens = await refreshAuthToken(refreshToken);
    res.json(tokens);
  } catch (err) {
    next(err);
  }
});

router.post('/logout', body('refreshToken').isString(), async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    await logoutUser(refreshToken);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
