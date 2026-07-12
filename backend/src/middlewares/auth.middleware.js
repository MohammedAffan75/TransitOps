import { verifyToken } from '../utils/auth.utils.js';
import ApiError from '../utils/ApiError.js';

/**
 * Middleware to verify a valid JWT access token and attach user payload to the request.
 */
export function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new ApiError(401, 'Access token required. Please provide header format: Authorization: Bearer <token>'));
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return next(new ApiError(401, 'Invalid format. Token is missing.'));
    }

    try {
      const decoded = verifyToken(token, false);
      req.user = decoded;
      return next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return next(new ApiError(401, 'Access token has expired.'));
      }
      return next(new ApiError(401, 'Invalid access token.'));
    }
  } catch (error) {
    console.error('Error in requireAuth middleware:', error);
    return next(new ApiError(500, 'Internal server error in auth verification.'));
  }
}

/**
 * Role-Based Access Control (RBAC) middleware factory.
 * Restricts route access to users possessing any of the specified roles.
 * @param {string[]} allowedRoles 
 */
export function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required.'));
    }

    const { role } = req.user;

    if (!allowedRoles.includes(role)) {
      return next(new ApiError(403, `Access forbidden. Authorized roles: ${allowedRoles.join(', ')}`));
    }

    return next();
  };
}
