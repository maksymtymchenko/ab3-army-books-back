import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

/**
 * Log basic HTTP request/response information.
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP request', {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: duration
    });
  });

  next();
};
