import prisma from './src/config/database.js';
import bcrypt from 'bcryptjs';

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const user = await prisma.user.upsert({
      where: { email: 'admin@studyroom.com' },
      update: {
        role: 'admin',
        passwordHash: hashedPassword,
      },
      create: {
        name: 'Super Admin',
        email: 'admin@studyroom.com',
        passwordHash: hashedPassword,
        role: 'admin',
      }
    });
    console.log("✅ Admin user ready!");
    console.log("Email: admin@studyroom.com");
    console.log("Password: admin123");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
