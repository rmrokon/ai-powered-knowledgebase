import { Request, Response, NextFunction } from 'express';

interface ErrorResponse {
  error: string;
  message: string;
  timestamp: string;
  path: string;
  statusCode: number;
  details?: any;
}

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export function globalErrorHandler(
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Default values
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal Server Error';
  let errorType = error.name || 'Error';

  // Handle specific error types
  if (error.name === 'ValidationError') {
    statusCode = 400;
    errorType = 'Validation Error';
  } else if (error.name === 'CastError') {
    statusCode = 400;
    errorType = 'Invalid Data Format';
    message = 'Invalid data provided';
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorType = 'Authentication Error';
    message = 'Invalid token';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    errorType = 'Authentication Error';
    message = 'Token expired';
  } else if (error.name === 'MongoError' && error.message.includes('duplicate key')) {
    statusCode = 409;
    errorType = 'Duplicate Entry';
    message = 'Resource already exists';
  }

  // Log error (in production, use proper logging service)
  console.error(`[${new Date().toISOString()}] ${errorType}:`, {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Prepare response
  const errorResponse: ErrorResponse = {
    error: errorType,
    message,
    timestamp: new Date().toISOString(),
    path: req.path,
    statusCode,
  };

  // In development, include stack trace and additional details
  if (process.env.NODE_ENV === 'development') {
    errorResponse.details = {
      stack: error.stack,
      originalError: error.message,
    };
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
}

// Helper function to create custom errors
export function createError(message: string, statusCode: number = 500): AppError {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
}

// Async error handler wrapper
export function asyncHandler<T extends Request, U extends Response>(
  fn: (req: T, res: U, next: NextFunction) => Promise<any>
) {
  return (req: T, res: U, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// 404 handler (should be used before the global error handler)
export function notFoundHandler(req: Request, res: Response, next: NextFunction): void {
  const error = createError(`Route ${req.originalUrl} not found`, 404);
  next(error);
}

// Unhandled promise rejection handler
export function handleUnhandledRejections(): void {
  process.on('unhandledRejection', (reason: any) => {
    console.error('Unhandled Promise Rejection:', reason);
    // In production, you might want to gracefully shutdown
    // process.exit(1);
  });
}

// Uncaught exception handler
export function handleUncaughtExceptions(): void {
  process.on('uncaughtException', (error: Error) => {
    console.error('Uncaught Exception:', error);
    // Gracefully shutdown
    process.exit(1);
  });
}