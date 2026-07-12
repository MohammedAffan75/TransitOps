import * as authService from '../services/auth.service.js';

/**
 * Register a new user
 * POST /api/auth/register
 */
export async function register(req, res) {
  try {
    const user = await authService.registerUser(req.body);
    return res.status(201).json({
      message: 'User registered successfully.',
      user
    });
  } catch (error) {
    console.error('Error in registration:', error);
    return res.status(400).json({ error: error.message });
  }
}

/**
 * Log in a user
 * POST /api/auth/login
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    return res.status(200).json({
      message: 'Logged in successfully.',
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user
    });
  } catch (error) {
    console.error('Error in login:', error);
    const status = error.message.includes('Invalid email or password') ? 401 : 400;
    return res.status(status).json({ error: error.message });
  }
}

