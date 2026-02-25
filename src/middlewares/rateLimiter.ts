import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

/**
 * Rate limiter for reservation creation to prevent abuse.
 */
export const reservationRateLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) =>
    (req.ip || '') + (req.body?.phone ? `:${req.body.phone}` : ''),
  message: {
    error: 'too_many_requests',
    message: 'Too many reservation attempts, please try again later.'
  }
});
