import { Request, Response } from 'express';

/**
 * Fallback 404 handler for unknown routes.
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: 'not_found',
    message: `Route ${req.method} ${req.path} not found`
  });
};
