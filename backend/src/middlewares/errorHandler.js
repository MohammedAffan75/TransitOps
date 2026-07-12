import ApiError from '../utils/ApiError.js';

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.name = err.name;
  error.stack = err.stack;

  // Prisma Unique Constraint Violation (e.g., duplicate email)
  if (err.code === 'P2002') {
    const field = err.meta?.target ? err.meta.target.join(', ') : 'Field';
    const message = `Duplicate field value entered: ${field}. Please use another value.`;
    error = new ApiError(400, message);
  }

  // Prisma Record Not Found
  if (err.code === 'P2025') {
    const message = 'Record not found in the database.';
    error = new ApiError(404, message);
  }

  // Prisma Validation Error
  if (err.name === 'PrismaClientValidationError') {
    const message = 'Invalid input data provided.';
    error = new ApiError(400, message);
  }

  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  // Development: Send full stack trace
  if (process.env.NODE_ENV === 'development') {
    return res.status(error.statusCode).json({
      status: error.status,
      error: error,
      message: error.message,
      stack: error.stack,
    });
  }

  // Production: Only send operational errors to client, hide programming errors
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }
  
  // Programming or unknown errors: Don't leak error details
  console.error('ERROR:', error);
  return res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!',
  });
};

export default errorHandler;
