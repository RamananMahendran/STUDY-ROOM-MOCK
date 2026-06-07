import prisma from '../../config/database.js'; // centralized database.ts
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const User = {
  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return undefined;
    return {
      ...user,
      username: user.name,
      streak: user.streakCount,
      last_active_at: user.lastActiveAt,
      created_at: user.createdAt,
      avatar_url: user.avatarUrl,
    };
  },

  async findByUsername(username: string) {
    const user = await prisma.user.findFirst({ where: { name: username } });
    if (!user) return undefined;
    return {
      ...user,
      username: user.name,
      streak: user.streakCount,
      last_active_at: user.lastActiveAt,
      created_at: user.createdAt,
      avatar_url: user.avatarUrl,
    };
  },

  async findById(id: number | string) {
    const userId = Number(id);
    if (!Number.isInteger(userId)) return undefined;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return undefined;
    return {
      ...user,
      username: user.name,
      streak: user.streakCount,
      last_active_at: user.lastActiveAt,
      created_at: user.createdAt,
      avatar_url: user.avatarUrl,
    };
  },

  async create({ username, email, password }: any) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name: username,
        email,
        password: hashedPassword,
        streakCount: 0,
      }
    });

    return {
      ...user,
      username: user.name,
      streak: user.streakCount,
      last_active_at: user.lastActiveAt,
      created_at: user.createdAt,
      avatar_url: user.avatarUrl,
    };
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

    await prisma.user.update({
      where: { id: userId },
      data: {
        streakCount: newStreak,
        lastActiveAt: now
      }
    });

    return newStreak;
  },

  // ── Password Reset Methods ─────────────────────────────────────────────────

  async saveResetToken(userId: number): Promise<string> {
    const plainToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(plainToken).digest('hex');
    const expireAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { id: userId },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordExpire: expireAt
      }
    });

    return plainToken;
  },

  async findByResetToken(plainToken: string) {
    const hashedToken = crypto.createHash('sha256').update(plainToken).digest('hex');
    const now = new Date();

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { gt: now }
      }
    });

    if (!user) return undefined;
    return {
      ...user,
      username: user.name,
      streak: user.streakCount,
    };
  },

  async updatePassword(userId: number, newPassword: string): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        updatedAt: new Date()
      }
    });
  },

  async clearResetToken(userId: number): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        resetPasswordToken: null,
        resetPasswordExpire: null
      }
    });
  },

  // ── OAuth Methods ─────────────────────────────────────────────────────────

  async findByOAuthId(provider: string, providerClientId: string) {
    const oauthAccount = await prisma.oAuthAccount.findFirst({
      where: {
        provider,
        providerClientId
      },
      include: {
        user: true
      }
    });

    if (!oauthAccount || !oauthAccount.user) return undefined;
    const user = oauthAccount.user;
    return {
      ...user,
      username: user.name,
      streak: user.streakCount,
      last_active_at: user.lastActiveAt,
      avatar_url: user.avatarUrl,
    };
  },

  async linkOAuthAccount(userId: number, provider: string, providerClientId: string) {
    await prisma.oAuthAccount.upsert({
      where: {
        provider_providerClientId: {
          provider,
          providerClientId
        }
      },
      update: {},
      create: {
        userId,
        provider,
        providerClientId
      }
    });
  },

  async createOAuthUser({
    username,
    email,
    avatarUrl,
    provider,
    providerClientId,
  }: {
    username: string;
    email: string;
    avatarUrl?: string;
    provider: string;
    providerClientId: string;
  }) {
    const crypto = await import('crypto');
    const randomPassword = crypto.randomBytes(32).toString('hex');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(randomPassword, salt);

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name: username,
          email,
          password: hashedPassword,
          avatarUrl: avatarUrl ?? null,
          streakCount: 0,
        }
      });

      await tx.oAuthAccount.create({
        data: {
          userId: newUser.id,
          provider,
          providerClientId,
        }
      });

      return newUser;
    });

    return {
      ...user,
      username: user.name,
      streak: user.streakCount,
      last_active_at: user.lastActiveAt,
      created_at: user.createdAt,
      avatar_url: user.avatarUrl,
    };
  },

  async recordStudySession(userId: number, durationMs: number) {
    const durationHours = durationMs / (1000 * 60 * 60);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const now = new Date();
    const todayLabel = `${now.getMonth() + 1}/${now.getDate()}`;

    // Update study log
    let studyHoursLog = Array.isArray(user.studyHoursLog) ? (user.studyHoursLog as any[]) : [];
    const logIndex = studyHoursLog.findIndex((item: any) => item && item.label === todayLabel);
    if (logIndex > -1) {
      studyHoursLog[logIndex].value = parseFloat((studyHoursLog[logIndex].value + durationHours).toFixed(2));
    } else {
      studyHoursLog.push({ label: todayLabel, value: parseFloat(durationHours.toFixed(2)) });
    }

    // Determine heatmap coordinates
    const dayOfWeek = now.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
    const weeklyCol = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const hour = now.getHours();
    let weeklyRow = Math.floor((hour - 6) / 2);
    if (weeklyRow < 0) weeklyRow = 0;
    if (weeklyRow > 8) weeklyRow = 8;

    const yearlyCol = 31;
    const yearlyRow = weeklyCol;

    // Update heatmapData
    let heatmapData = Array.isArray(user.heatmapData) ? (user.heatmapData as any[]) : [];
    
    // Add weekly cell
    const hasWeekly = heatmapData.some((cell: any) => 
      cell && cell.type === 'weekly' && cell.col === weeklyCol && cell.row === weeklyRow
    );
    if (!hasWeekly) {
      heatmapData.push({ type: 'weekly', col: weeklyCol, row: weeklyRow });
    }

    // Add yearly cell
    const hasYearly = heatmapData.some((cell: any) => 
      cell && cell.type === 'yearly' && cell.col === yearlyCol && cell.row === yearlyRow
    );
    if (!hasYearly) {
      heatmapData.push({ type: 'yearly', col: yearlyCol, row: yearlyRow });
    }

    let incrementActiveDays = 0;
    if (user.studyHoursToday === 0) {
      incrementActiveDays = 1;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        totalStudyHours: { increment: durationHours },
        studyHoursToday: { increment: durationHours },
        studyHoursThisWeek: { increment: durationHours },
        focusSessionsCount: { increment: 1 },
        pomodorosToday: { increment: 1 },
        pomodorosTotal: { increment: 1 },
        totalSessions: { increment: 1 },
        activityActiveDays: { increment: incrementActiveDays },
        studyHoursLog,
        heatmapData,
        lastActiveAt: now
      }
    });

    return {
      ...updatedUser,
      username: updatedUser.name,
      streak: updatedUser.streakCount,
      last_active_at: updatedUser.lastActiveAt,
      created_at: updatedUser.createdAt,
      avatar_url: updatedUser.avatarUrl,
    };
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
