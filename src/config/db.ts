import mongoose from 'mongoose';
import { env } from './env';
import { logger } from './logger';

/**
 * Initialize MongoDB connection.
 */
export const connectDb = async (): Promise<void> => {
  try {
    await mongoose.connect(env.mongoUri);
    logger.info('MongoDB connected');
  } catch (err) {
    logger.error('MongoDB connection error', { error: err });
    process.exit(1);
  }
};
