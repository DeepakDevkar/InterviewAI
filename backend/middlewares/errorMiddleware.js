import { logger } from '../utils/logger.js';

export const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error stack trace
  logger.error(`${err.status.toUpperCase()} - ${err.message} \nStack: ${err.stack}`);

  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // Production Error Handling
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Programming or other unknown error: don't leak details
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong on the server',
  });
};
