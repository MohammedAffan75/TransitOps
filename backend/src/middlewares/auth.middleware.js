import { verifyToken } from '../utils/auth.utils.js';

/**
 * Middleware to verify a valid JWT access token and attach user payload to the request.
 */
export function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Access token required. Please provide header format: Authorization: Bearer <token>' 
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Invalid format. Token is missing.' });
    }

    try {
      const decoded = verifyToken(token, false);
      req.user = decoded;
      return next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Access token has expired.' });
      }
      return res.status(401).json({ error: 'Invalid access token.' });
    }
  } catch (error) {
    console.error('Error in requireAuth middleware:', error);
    return res.status(500).json({ error: 'Internal server error in auth verification.' });
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
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const { role } = req.user;

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ 
        error: `Access forbidden. Authorized roles: ${allowedRoles.join(', ')}` 
      });
    }

    return next();
  };
}
