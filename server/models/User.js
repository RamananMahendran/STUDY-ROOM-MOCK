import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

const User = {
  // Find a user by email
  async findByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },

  // Find a user by username
  async findByUsername(username) {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
  },

  // Find a user by ID
  async findById(id) {
    const result = await pool.query('SELECT id, username, email, streak, created_at FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  // Create a new user
  async create({ username, email, password }) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      'INSERT INTO users (username, email, password, streak) VALUES ($1, $2, $3, $4) RETURNING id, username, email, streak, created_at',
      [username, email, hashedPassword, 0]
    );

    return result.rows[0];
  },

  // Compare password
  async matchPassword(enteredPassword, hashedPassword) {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  }
};

export default User;
