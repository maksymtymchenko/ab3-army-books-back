import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import 'express-async-errors';
import { apiRouter } from './routes';
import { notFoundHandler } from './middlewares/notFoundHandler';
import { errorHandler } from './middlewares/errorHandler';
import { basicSanitizer } from './utils/sanitize';
import { requestLogger } from './middlewares/requestLogger';
import { env } from './config/env';

/**
 * Create and configure Express application instance.
 */
export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.corsOrigin
    })
  );
  app.use(express.json());
  app.use(basicSanitizer);
  app.use(requestLogger);

  app.get('/ping', (_req, res) => {
    res.status(200).json({ ok: true });
  });

  app.use('/api', apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
