import type { RequestHandler } from 'express';

/**
 * Basic input sanitizer to reduce injection risk.
 */
export const basicSanitizer: RequestHandler = (req, _res, next) => {
  const sanitizeValue = (value: unknown): unknown => {
    if (typeof value === 'string') {
      return value.replace(/\$/g, '').replace(/\./g, '').trim();
    }
    if (Array.isArray(value)) {
      return value.map(sanitizeValue);
    }
    if (value && typeof value === 'object') {
      const copy: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(value)) {
        copy[k] = sanitizeValue(v);
      }
      return copy;
    }
    return value;
  };

  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  if (req.query) {
    req.query = sanitizeValue(req.query) as any;
  }
  next();
};
