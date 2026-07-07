import { AppError } from './appError.js';

/**
 * Validates request data against required fields.
 * Can be easily integrated with libraries like Joi or Zod later.
 */
export const validateFields = (fields, required) => {
  const missing = [];
  required.forEach((field) => {
    if (fields[field] === undefined || fields[field] === null || fields[field] === '') {
      missing.push(field);
    }
  });

  if (missing.length > 0) {
    throw new AppError(`Missing required fields: ${missing.join(', ')}`, 400);
  }
};
