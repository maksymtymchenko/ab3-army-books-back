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
  /**
   * Cloudflare R2 S3-compatible endpoint URL.
   * Example: https://<account_id>.r2.cloudflarestorage.com
   */
  r2Endpoint: string;
  /**
   * Cloudflare R2 access key ID.
   */
  r2AccessKeyId: string;
  /**
   * Cloudflare R2 secret access key.
   */
  r2SecretAccessKey: string;
  /**
   * Cloudflare R2 bucket used for book covers.
   */
  r2BucketName: string;
  /**
   * Public base URL used to serve book cover images.
   * Example: https://cdn.example.com/books
   */
  r2PublicBaseUrl: string;
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
  notifyWebhookSecret: process.env.NOTIFY_WEBHOOK_SECRET,
  r2Endpoint: process.env.R2_ENDPOINT || '',
  r2AccessKeyId: process.env.R2_ACCESS_KEY_ID || '',
  r2SecretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  r2BucketName: process.env.R2_BUCKET_NAME || '',
  r2PublicBaseUrl: process.env.R2_PUBLIC_BASE_URL || ''
};
