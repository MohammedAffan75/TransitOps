import * as authService from '../services/auth.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);
  return res.status(201).json(new ApiResponse(201, { user }, 'User registered successfully.'));
});

/**
 * Log in a user
 * POST /api/auth/login
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);
  
  return res.status(200).json(new ApiResponse(200, {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    user: result.user
  }, 'Logged in successfully.'));
});

/**
 * Get current user
 * GET /api/auth/me
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.id);
  return res.status(200).json(new ApiResponse(200, { user }, 'User retrieved successfully.'));
});

/**
 * Logout a user
 * POST /api/auth/logout
 */
export const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user.id);
  return res.status(200).json(new ApiResponse(200, null, 'Logged out successfully.'));
});
