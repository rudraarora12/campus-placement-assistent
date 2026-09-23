const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userStore = require('./userStore');

const JWT_SECRET = process.env.JWT_SECRET || 'campus-placement-auth-secret-key-2026-secure-jwt';
const COOKIE_NAME = 'campus_placement_session';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};

/**
 * Validates password complexity:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return 'Password is required.';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter.';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter.';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number.';
  }
  return null;
}

/**
 * Validates email format.
 */
function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return 'Email address is required.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address.';
  }
  return null;
}

/**
 * Signs a JWT session token for a user.
 */
function generateToken(user) {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * Verifies a JWT session token.
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

/**
 * Handles user registration.
 */
async function signup({ name, email, password, course, branch, graduationYear }) {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw new Error('Full name is required.');
  }

  const emailError = validateEmail(email);
  if (emailError) throw new Error(emailError);

  const passwordError = validatePassword(password);
  if (passwordError) throw new Error(passwordError);

  if (!course || typeof course !== 'string' || course.trim() === '') {
    throw new Error('Degree / course is required.');
  }
  if (!branch || typeof branch !== 'string' || branch.trim() === '') {
    throw new Error('Branch is required.');
  }
  if (!graduationYear) {
    throw new Error('Graduation year is required.');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // Create user in store
  const user = await userStore.createUser({
    name,
    email,
    passwordHash,
    course,
    branch,
    graduationYear,
  });

  const token = generateToken(user);

  return {
    user,
    token,
  };
}

/**
 * Handles user login.
 */
async function login({ email, password }) {
  const emailError = validateEmail(email);
  if (emailError) throw new Error('Invalid email or password.');

  if (!password || typeof password !== 'string') {
    throw new Error('Invalid email or password.');
  }

  const user = await userStore.findByEmail(email);
  if (!user) {
    // Timing safe comparison simulation
    await bcrypt.compare(password, '$2a$10$abcdefghijklmnopqrstuvwxyz123456');
    throw new Error('Invalid email or password.');
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new Error('Invalid email or password.');
  }

  const { passwordHash: _, ...sanitizedUser } = user;
  const token = generateToken(sanitizedUser);

  return {
    user: sanitizedUser,
    token,
  };
}

/**
 * Retrieves the user profile from a session token.
 */
async function getUserFromToken(token) {
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded || !decoded.userId) return null;

  const user = await userStore.findById(decoded.userId);
  if (!user) return null;

  const { passwordHash: _, ...sanitizedUser } = user;
  return sanitizedUser;
}

module.exports = {
  COOKIE_NAME,
  COOKIE_OPTIONS,
  validatePassword,
  validateEmail,
  signup,
  login,
  getUserFromToken,
};
