import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { ERROR_CODES, ErrorCode } from '../utils/constants';
import { logger } from '../config/logger';

/**
 * Centralized API error handler.
 */
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let errorCode: ErrorCode = ERROR_CODES.INTERNAL_ERROR;
  let message = 'Internal server error';
  let fields: Record<string, string> | undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    errorCode = err.errorCode;
    message = err.message;

    if (
      statusCode === 400 &&
      err.errorCode === ERROR_CODES.VALIDATION_ERROR &&
      err.details &&
      typeof err.details === 'object'
    ) {
      fields = err.details as Record<string, string>;
    }
  } else if (err instanceof Error) {
    message = err.message;
  }

  logger.error('Request error', {
    statusCode,
    errorCode,
    message,
    stack: err instanceof Error ? err.stack : undefined
  });

  if (statusCode === 400 && errorCode === ERROR_CODES.VALIDATION_ERROR && fields) {
    res.status(statusCode).json({
      error: 'validation_error',
      fields
    });
    return;
  }

  if (statusCode === 400 && errorCode === ERROR_CODES.INVALID_QUERY) {
    res.status(statusCode).json({
      error: 'invalid_query',
      message
    });
    return;
  }

  if (statusCode === 404 && errorCode === ERROR_CODES.BOOK_NOT_FOUND) {
    res.status(statusCode).json({
      error: 'book_not_found',
      message: 'Book with given id not found'
    });
    return;
  }

  if (statusCode === 409 && errorCode === ERROR_CODES.BOOK_NOT_RESERVABLE) {
    res.status(statusCode).json({
      error: 'book_not_reservable',
      message: 'Book is already issued or reserved'
    });
    return;
  }

  if (statusCode === 400 && errorCode === ERROR_CODES.INVALID_PARAMS) {
    res.status(statusCode).json({
      error: 'invalid_params',
      message
    });
    return;
  }

  res.status(statusCode).json({
    error: 'internal_error',
    message
  });
};
