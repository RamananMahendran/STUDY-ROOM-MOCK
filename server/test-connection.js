import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: '127.0.0.1',  // Use IP instead of localhost
  port: 5432,
  user: 'postgres',
  password: 'postgres_password',
  database: 'studyplatform',
});

async function test() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Connection successful!', result.rows[0]);
    await pool.end();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

test();
