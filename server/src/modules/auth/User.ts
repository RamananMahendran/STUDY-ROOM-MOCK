import prisma from '../../config/database.js'; // centralized database.ts
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const User = {
  async findByEmail(email: string) {
    const rows: any = await prisma.$queryRaw`
      SELECT id, name AS username, email, password, streak_count AS streak, last_active_at, created_at
      FROM users
      WHERE email = ${email}
    `;
    return rows[0];
  },

  async findByUsername(username: string) {
    const rows: any = await prisma.$queryRaw`
      SELECT id, name AS username, email, password, streak_count AS streak, last_active_at, created_at
      FROM users
      WHERE name = ${username}
    `;
    return rows[0];
  },

  async findById(id: number | string) {
    const userId = Number(id);
    if (!Number.isInteger(userId)) return undefined;

    const rows: any = await prisma.$queryRaw`
      SELECT id, name AS username, email, streak_count AS streak, last_active_at, created_at
      FROM users
      WHERE id = ${userId}
    `;
    return rows[0];
  },

  async create({ username, email, password }: any) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const rows: any = await prisma.$queryRaw`
      INSERT INTO users (name, email, password, streak_count, updated_at)
      VALUES (${username}, ${email}, ${hashedPassword}, 0, CURRENT_TIMESTAMP)
      RETURNING id, name AS username, email, streak_count AS streak, created_at
    `;
    return rows[0];
  },

  async matchPassword(enteredPassword: string, hashedPassword: string) {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  },

  async updateStreak(userId: number, lastActiveAt: Date | null, currentStreak: number) {
    const now = new Date();
    let newStreak = currentStreak;

    if (lastActiveAt) {
      const lastActiveDate = new Date(lastActiveAt);
      lastActiveDate.setHours(0, 0, 0, 0);
      const today = new Date(now);
      today.setHours(0, 0, 0, 0);

      const diffTime = today.getTime() - lastActiveDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    await prisma.$executeRaw`
      UPDATE users
      SET streak_count = ${newStreak},
          last_active_at = ${now}
      WHERE id = ${userId}
    `;

    return newStreak;
  },

  // ── Password Reset Methods ─────────────────────────────────────────────────

  /**
   * Generates a secure random token, hashes it for DB storage,
   * saves the hash + expiry (10 min) to the user row,
   * and returns the PLAIN token to send in the email.
   */
  async saveResetToken(userId: number): Promise<string> {
    // 1. Generate cryptographically secure random token (32 bytes → 64 hex chars)
    const plainToken = crypto.randomBytes(32).toString('hex');

    // 2. Hash it before storing – so even if DB is compromised, tokens can't be used
    const hashedToken = crypto.createHash('sha256').update(plainToken).digest('hex');

    // 3. 10-minute expiry
    const expireAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.$executeRaw`
      UPDATE users
      SET reset_password_token = ${hashedToken},
          reset_password_expire = ${expireAt}
      WHERE id = ${userId}
    `;

    return plainToken; // ← send this in the email link
  },

  /**
   * Looks up a user by the hashed form of the plain token,
   * only if the token hasn't expired yet.
   */
  async findByResetToken(plainToken: string) {
    const hashedToken = crypto.createHash('sha256').update(plainToken).digest('hex');
    const now = new Date();

    const rows: any = await prisma.$queryRaw`
      SELECT id, name AS username, email, streak_count AS streak
      FROM users
      WHERE reset_password_token = ${hashedToken}
        AND reset_password_expire > ${now}
    `;
    return rows[0];
  },

  /**
   * Hashes and saves the new password for the given user ID.
   */
  async updatePassword(userId: number, newPassword: string): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.$executeRaw`
      UPDATE users
      SET password = ${hashedPassword},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${userId}
    `;
  },

  /**
   * Clears the reset token fields after a successful reset.
   */
  async clearResetToken(userId: number): Promise<void> {
    await prisma.$executeRaw`
      UPDATE users
      SET reset_password_token = NULL,
          reset_password_expire = NULL
      WHERE id = ${userId}
    `;
  },
};

export default User;

// import pool from '../config/db.js';
// import bcrypt from 'bcryptjs';

// const User = {
//   // Find a user by email
//   async findByEmail(email) {
//     const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
//     return result.rows[0];
//   },

//   // Find a user by username
//   async findByUsername(username) {
//     const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
//     return result.rows[0];
//   },

//   // Find a user by ID
//   async findById(id) {
//     const result = await pool.query('SELECT id, username, email, streak, created_at FROM users WHERE id = $1', [id]);
//     return result.rows[0];
//   },

//   // Create a new user
//   async create({ username, email, password }) {
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const result = await pool.query(
//       'INSERT INTO users (username, email, password, streak) VALUES ($1, $2, $3, $4) RETURNING id, username, email, streak, created_at',
//       [username, email, hashedPassword, 0]
//     );

//     return result.rows[0];
//   },

//   // Compare password
//   async matchPassword(enteredPassword, hashedPassword) {
//     return await bcrypt.compare(enteredPassword, hashedPassword);
//   }
// };

// export default User;
