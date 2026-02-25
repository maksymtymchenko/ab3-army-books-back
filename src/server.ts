import { createServer } from 'http';
import { createApp } from './app';
import { env } from './config/env';
import { connectDb } from './config/db';
import { logger } from './config/logger';

/**
 * Application entrypoint.
 */
const start = async () => {
  await connectDb();

  const app = createApp();
  const server = createServer(app);

  server.listen(env.port, () => {
    logger.info('Server started', {
      port: env.port,
      env: env.nodeEnv
    });
  });
};

start().catch((err) => {
  logger.error('Fatal startup error', { error: err });
  process.exit(1);
});

