import dotenv from 'dotenv';
dotenv.config();

console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
