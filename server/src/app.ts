import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import { getActiveConfig } from './config';
import authRouter from './routes/auth';
import usersRouter from './routes/users';
import serversRouter from './routes/servers';
import channelsRouter from './routes/channels';
import messagesRouter from './routes/messages';

import { errorHandler } from './middleware/errorHandler';
import { logger } from './logger';
const app = express();

app.use(helmet());
app.use((req, res, next) => {
  const config = getActiveConfig();
  res.set('Access-Control-Allow-Origin', config.clientUrl || '*');
  return cors({ origin: config.clientUrl || '*', credentials: true })(req, res, next);
});
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/servers', serversRouter);
app.use('/api/servers', channelsRouter);
app.use('/api/channels', messagesRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Resource not found' });
});

app.use(errorHandler);

export default app;
