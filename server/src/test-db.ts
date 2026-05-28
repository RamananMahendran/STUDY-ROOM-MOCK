// src/test-db.ts
import prisma from './config/database';

async function runDatabaseDiagnostic() {
  console.log('🔄 Initializing Database Diagnostic Test...');

  try {
    // 1. Test Basic Connection
    console.log('\n📡 Testing Connection...');
    const timeCheck: any = await prisma.$queryRaw`SELECT NOW() as current_time`;
    console.log(`✅ Connection Successful! Database Time: ${timeCheck[0].current_time}`);

    // 2. Test Write Capabilities (Create table & Insert)
    console.log('\n✍️ Testing Write Capabilities...');
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS _test_diagnostic (id SERIAL PRIMARY KEY, message TEXT)`;
    await prisma.$executeRaw`INSERT INTO _test_diagnostic (message) VALUES ('Docker to Postgres pipeline is fully operational!')`;
    console.log('✅ Write Successful! Inserted test record into database.');

    // 3. Test Read Capabilities (Select)
    console.log('\n📖 Testing Read Capabilities...');
    const records: any = await prisma.$queryRaw`SELECT * FROM _test_diagnostic ORDER BY id DESC LIMIT 1`;
    console.log('✅ Read Successful! Data retrieved from database:');
    console.log(`   -> ID: ${records[0].id} | Message: "${records[0].message}"`);

    // 4. Cleanup
    console.log('\n🧹 Cleaning up test data...');
    await prisma.$executeRaw`DROP TABLE _test_diagnostic`;
    console.log('✅ Cleanup Successful! Temporary table destroyed.');

    console.log('\n🎉 ALL TESTS PASSED! Your Docker Database is completely ready for development.');

  } catch (error) {
    console.error('\n❌ DATABASE TEST FAILED! See error below:');
    console.error(error);
  } finally {
    // Always disconnect the Prisma client when done
    await prisma.$disconnect();
  }
}

runDatabaseDiagnostic();