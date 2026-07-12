import prisma from '../config/prisma.js';
import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken } from '../utils/auth.utils.js';

// Allowed roles from the database enum definition
const ALLOWED_ROLES = ['FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'];

/**
 * Register a new user
 * POST /api/auth/register
 */
export async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    // 1. Basic validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields (name, email, password, role) are required.' });
    }

    // 2. Validate role matches allowed enum values
    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({ 
        error: `Invalid role. Allowed roles are: ${ALLOWED_ROLES.join(', ')}` 
      });
    }

    // 3. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered.' });
    }

    // 4. Hash password
    const hashedPassword = await hashPassword(password);

    // 5. Create user record
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role
      }
    });

    // 6. Return user details (exclude password and token fields)
    return res.status(201).json({
      message: 'User registered successfully.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
      }
    });

  } catch (error) {
    console.error('Error in registration:', error);
    return res.status(500).json({ error: 'Internal server error during registration.' });
  }
}

/**
 * Log in a user
 * POST /api/auth/login
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // 1. Validate fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // 2. Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // 3. Match password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // 4. Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // 5. Save tokens to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        accessToken,
        refreshToken
      }
    });

    // 6. Send response with user payload and tokens
    return res.status(200).json({
      message: 'Logged in successfully.',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error in login:', error);
    return res.status(500).json({ error: 'Internal server error during login.' });
  }
}
