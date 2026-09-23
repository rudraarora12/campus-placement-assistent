const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure users file exists
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]), 'utf8');
}

/**
 * UserStore provides a clean persistent data access layer for users.
 * Structured to seamlessly map to MongoDB or other databases.
 */
class UserStore {
  constructor() {
    this.filePath = USERS_FILE;
  }

  _readUsers() {
    try {
      const content = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(content || '[]');
    } catch (err) {
      console.error('Error reading users file:', err);
      return [];
    }
  }

  _writeUsers(users) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(users, null, 2), 'utf8');
    } catch (err) {
      console.error('Error writing users file:', err);
      throw new Error('Failed to save user data');
    }
  }

  /**
   * Finds a user by case-insensitive email address.
   * @param {string} email
   * @returns {Object|null}
   */
  async findByEmail(email) {
    if (!email) return null;
    const users = this._readUsers();
    const normalized = email.toLowerCase().trim();
    return users.find((u) => u.email.toLowerCase() === normalized) || null;
  }

  /**
   * Finds a user by unique ID.
   * @param {string} id
   * @returns {Object|null}
   */
  async findById(id) {
    if (!id) return null;
    const users = this._readUsers();
    return users.find((u) => u._id === id) || null;
  }

  /**
   * Creates a new user record.
   * @param {Object} userData
   * @returns {Object} Created user without passwordHash
   */
  async createUser({ name, email, passwordHash, course, branch, graduationYear }) {
    const users = this._readUsers();
    const normalizedEmail = email.toLowerCase().trim();

    // Check duplicate email
    if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      const err = new Error('An account with this email address already exists.');
      err.code = 'DUPLICATE_EMAIL';
      throw err;
    }

    const newUser = {
      _id: `usr_${crypto.randomBytes(12).toString('hex')}`,
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      course: course ? course.trim() : 'B.E.',
      branch: branch ? branch.trim() : 'Computer Science & Engineering',
      graduationYear: graduationYear ? String(graduationYear).trim() : '2027',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);
    this._writeUsers(users);

    // Return sanitized user object
    const { passwordHash: _, ...sanitizedUser } = newUser;
    return sanitizedUser;
  }

  /**
   * Updates an existing user record.
   * @param {string} id
   * @param {Object} updates
   * @returns {Object} Updated user without passwordHash
   */
  async updateUser(id, updates) {
    const users = this._readUsers();
    const index = users.findIndex((u) => u._id === id);
    if (index === -1) {
      throw new Error('User not found.');
    }

    const current = users[index];
    const updated = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    users[index] = updated;
    this._writeUsers(users);

    const { passwordHash: _, ...sanitizedUser } = updated;
    return sanitizedUser;
  }
}

const userStore = new UserStore();
module.exports = userStore;
