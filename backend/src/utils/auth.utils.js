import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'default-access-secret-key-12345';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-key-12345';

/**
 * Hash a password using bcrypt
 * @param {string} password 
 * @returns {Promise<string>}
 */
export async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Compare plain text password with hashed password
 * @param {string} password 
 * @param {string} hashedPassword 
 * @returns {Promise<boolean>}
 */
export async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * Generate a short-lived JWT Access Token
 * @param {object} user 
 * @returns {string}
 */
export function generateAccessToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role
  };
  return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: '8h' });
}

/**
 * Generate a long-lived JWT Refresh Token
 * @param {object} user 
 * @returns {string}
 */
export function generateRefreshToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role
  };
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

/**
 * Verify a JWT Access or Refresh Token
 * @param {string} token 
 * @param {boolean} isRefresh 
 * @returns {object} The decoded payload
 */
export function verifyToken(token, isRefresh = false) {
  const secret = isRefresh ? JWT_REFRESH_SECRET : JWT_ACCESS_SECRET;
  return jwt.verify(token, secret);
}
