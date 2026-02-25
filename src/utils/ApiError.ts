import { ErrorCode, ERROR_CODES } from './constants';

/**
 * Base API error type with HTTP status and machine-readable code.
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: ErrorCode;
  public readonly details?: unknown;

  constructor(
    statusCode: number,
    errorCode: ErrorCode,
    message: string,
    details?: unknown
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * 404 not found error.
 */
export class NotFoundError extends ApiError {
  constructor(errorCode: ErrorCode, message: string) {
    super(404, errorCode, message);
  }
}

/**
 * 409 conflict error (e.g. non-reservable book).
 */
export class ConflictError extends ApiError {
  constructor(errorCode: ErrorCode, message: string) {
    super(409, errorCode, message);
  }
}

/**
 * 400 validation error with field-level details.
 */
export class ValidationError extends ApiError {
  constructor(details: Record<string, string>) {
    super(400, ERROR_CODES.VALIDATION_ERROR, 'Validation error', details);
  }
}

/**
 * 400 invalid params error (e.g. pagination).
 */
export class InvalidParamsError extends ApiError {
  constructor(message: string) {
    super(400, ERROR_CODES.INVALID_PARAMS, message);
  }
}

/**
 * 400 invalid query error (e.g. search query too short).
 */
export class InvalidQueryError extends ApiError {
  constructor(message: string) {
    super(400, ERROR_CODES.INVALID_QUERY, message);
  }
}
