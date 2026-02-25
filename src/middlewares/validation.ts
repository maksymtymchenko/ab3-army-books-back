import { RequestHandler } from 'express';
import Joi from 'joi';
import { ValidationError } from '../utils/ApiError';

type SchemaTarget = 'body' | 'query' | 'params';

/**
 * Express middleware factory for Joi validation.
 */
export const validate =
  (schema: Joi.ObjectSchema, target: SchemaTarget): RequestHandler =>
  (req, _res, next) => {
    const value = (req as any)[target];
    const { error, value: validated } = schema.validate(value, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const fields: Record<string, string> = {};
      for (const detail of error.details) {
        const key = detail.path.join('.') || 'value';
        fields[key] = detail.message;
      }
      return next(new ValidationError(fields));
    }

    (req as any)[target] = validated;
    next();
  };
