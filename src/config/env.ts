import dotenv from 'dotenv';

dotenv.config();

export interface EnvConfig {
  nodeEnv: string;
  port: number;
  mongoUri: string;
  logLevel: string;
  rateLimitWindowMs: number;
  rateLimitMax: number;
  corsOrigin: string | RegExp | (string | RegExp)[];
  /**
   * Optional URL of the bot notification webhook endpoint.
   * Example: http://localhost:3131/notify/new-reservation
   */
  notifyWebhookUrl?: string;
  /**
   * Optional shared secret sent as X-Notify-Secret header.
   */
  notifyWebhookSecret?: string;
}

const parseNumber = (value: string | undefined, fallback: number): number => {
  const num = value ? Number(value) : NaN;
  return Number.isFinite(num) ? num : fallback;
};

export const env: EnvConfig = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseNumber(process.env.PORT, 3000),
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/biblioteka',
  logLevel: process.env.LOG_LEVEL || 'info',
  rateLimitWindowMs: parseNumber(process.env.RATE_LIMIT_WINDOW_MS, 60_000),
  rateLimitMax: parseNumber(process.env.RATE_LIMIT_MAX, 20),
  corsOrigin: process.env.CORS_ORIGIN || '*',
  notifyWebhookUrl: process.env.NOTIFY_WEBHOOK_URL,
  notifyWebhookSecret: process.env.NOTIFY_WEBHOOK_SECRET
};
