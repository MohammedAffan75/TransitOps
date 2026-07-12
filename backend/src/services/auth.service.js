import prisma from '../config/prisma.js';
import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken } from '../utils/auth.utils.js';
import ApiError from '../utils/ApiError.js';

const ALLOWED_ROLES = ['FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'];

/**
 * Register a new user in the database.
 */
export async function registerUser(data) {
  const { name, email, password, role } = data;

  if (!name || !email || !password || !role) {
    throw new ApiError(400, 'All fields (name, email, password, role) are required.');
  }

  if (!ALLOWED_ROLES.includes(role)) {
    throw new ApiError(400, `Invalid role. Allowed roles are: ${ALLOWED_ROLES.join(', ')}`);
  }

  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new ApiError(400, 'Email is already registered.');
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role
    }
  });

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    createdAt: newUser.createdAt,
    updatedAt: newUser.updatedAt
  };
}

/**
 * Verify credentials and return signed access and refresh tokens.
 */
export async function loginUser(email, password) {
  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required.');
  }

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      accessToken,
      refreshToken
    }
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
}
