import app from './app.js';
import prisma from './config/database.js';
import { protect } from './middleware/authMiddleware.js';
import { getUserProfile, loginUser, registerUser } from './modules/auth/authController.js';
import {
  createProblem,
  deleteProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
} from './modules/practice/problemController.js';

type QueryRow = Record<string, any>;

const requiredSchema: Record<string, string[]> = {
  users: ['id', 'name', 'email', 'password', 'streak_count', 'created_at', 'updated_at'],
  problems: ['id', 'title', 'slug', 'description', 'difficulty', 'tags', 'test_cases', 'created_at', 'updated_at'],
};

const assert = (condition: unknown, message: string): void => {
  if (!condition) {
    throw new Error(message);
  }
};

const createMockResponse = () => {
  const response: any = {
    statusCode: 200,
    body: undefined,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(body: any) {
      this.body = body;
      return this;
    },
  };

  return response;
};

const runController = async (handler: Function, requestData: any = {}) => {
  const response = createMockResponse();
  const request = {
    body: {},
    params: {},
    query: {},
    headers: {},
    ...requestData,
  };
  const next = (error?: unknown) => {
    if (error) throw error;
  };

  await handler(request, response, next);
  return { request, response };
};

async function validateDatabaseConnection(): Promise<void> {
  console.log('[1/5] Verifying database engine connection...');
  const dbTime = await prisma.$queryRaw<QueryRow[]>`SELECT NOW() as current_time`;
  console.log(`PASS: Database connection stable at ${dbTime[0].current_time}`);
}

async function validateRequiredSchema(): Promise<void> {
  console.log('\n[2/5] Validating required tables and columns...');

  const tableRows = await prisma.$queryRaw<{ table_name: string }[]>`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name IN ('users', 'problems')
  `;
  const existingTables = new Set(tableRows.map((row) => row.table_name));
  const missingTables = Object.keys(requiredSchema).filter((table) => !existingTables.has(table));

  assert(
    missingTables.length === 0,
    `Missing table(s): ${missingTables.join(', ')}. Run Prisma schema sync before testing the API.`,
  );

  const columnRows = await prisma.$queryRaw<{ table_name: string; column_name: string }[]>`
    SELECT table_name, column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name IN ('users', 'problems')
  `;

  const columnsByTable = columnRows.reduce<Record<string, Set<string>>>((acc, row) => {
    acc[row.table_name] ||= new Set<string>();
    acc[row.table_name].add(row.column_name);
    return acc;
  }, {});

  const missingColumns = Object.entries(requiredSchema).flatMap(([table, columns]) => (
    columns
      .filter((column) => !columnsByTable[table]?.has(column))
      .map((column) => `${table}.${column}`)
  ));

  assert(
    missingColumns.length === 0,
    `Missing column(s): ${missingColumns.join(', ')}. Run Prisma schema sync before testing the API.`,
  );

  console.log('PASS: Required server tables and columns are present.');
}

async function runAppFeatureTest(): Promise<void> {
  console.log('\n[3/5] Testing health feature...');

  assert(typeof app === 'function', 'Express app did not initialize correctly');

  console.log('PASS: Express app imports and route wiring initializes correctly.');
}

async function runAuthFeatureTest(testEmail: string, testUsername: string): Promise<string> {
  console.log('\n[4/5] Testing auth feature...');

  const password = 'SecureDiagnosticPass123!';
  const register = await runController(registerUser, {
    body: { username: testUsername, email: testEmail, password },
  });

  assert(register.response.statusCode === 201, `Register returned HTTP ${register.response.statusCode}: ${JSON.stringify(register.response.body)}`);
  assert(register.response.body?.token, 'Register did not return a JWT');
  assert(register.response.body?.username === testUsername, 'Register did not return the created username');

  const login = await runController(loginUser, {
    body: { email: testEmail, password },
  });

  assert(login.response.statusCode === 200, `Login returned HTTP ${login.response.statusCode}: ${JSON.stringify(login.response.body)}`);
  assert(login.response.body?.token, 'Login did not return a JWT');

  const protectedRequest = {
    headers: { authorization: `Bearer ${login.response.body.token}` },
  };
  const protectedResponse = createMockResponse();
  await protect(protectedRequest as any, protectedResponse, (error?: unknown) => {
    if (error) throw error;
  });

  const profile = await runController(getUserProfile, protectedRequest);

  assert(profile.response.statusCode === 200, `Profile returned HTTP ${profile.response.statusCode}: ${JSON.stringify(profile.response.body)}`);
  assert(profile.response.body?.email === testEmail, 'Profile did not return the authenticated user');

  console.log('PASS: Auth register, login, and profile workflow works.');
  return login.response.body.token;
}

async function runProblemsFeatureTest(timestamp: number): Promise<number> {
  console.log('\n[5/5] Testing problems feature...');

  const title = `Diagnostic Problem ${timestamp}`;
  const updatedTitle = `Diagnostic Problem Updated ${timestamp}`;

  const created = await runController(createProblem, {
    body: {
      title,
      description: 'Return the number one.',
      difficulty: 'easy',
      tags: ['diagnostic', 'smoke'],
      test_cases: [{ input: '', expected: '1' }],
    },
  });

  assert(created.response.statusCode === 201, `Create problem returned HTTP ${created.response.statusCode}: ${JSON.stringify(created.response.body)}`);
  assert(created.response.body?.data?.id, 'Create problem did not return an id');

  const problemId = Number(created.response.body.data.id);
  const listed = await runController(getAllProblems, {
    query: { difficulty: 'easy', limit: '1' },
  });
  assert(listed.response.statusCode === 200, `List problems returned HTTP ${listed.response.statusCode}: ${JSON.stringify(listed.response.body)}`);
  assert(Array.isArray(listed.response.body?.data), 'List problems did not return an array');

  const fetched = await runController(getProblemById, {
    params: { id: String(problemId) },
  });
  assert(fetched.response.statusCode === 200, `Get problem returned HTTP ${fetched.response.statusCode}: ${JSON.stringify(fetched.response.body)}`);
  assert(fetched.response.body?.data?.title === title, 'Get problem did not return the created problem');

  const updated = await runController(updateProblem, {
    params: { id: String(problemId) },
    body: {
      title: updatedTitle,
      description: 'Return the number two.',
      difficulty: 'medium',
      tags: ['diagnostic', 'updated'],
      test_cases: [{ input: '', expected: '2' }],
    },
  });

  assert(updated.response.statusCode === 200, `Update problem returned HTTP ${updated.response.statusCode}: ${JSON.stringify(updated.response.body)}`);
  assert(updated.response.body?.data?.title === updatedTitle, 'Update problem did not return the updated title');

  const deleted = await runController(deleteProblem, {
    params: { id: String(problemId) },
  });
  assert(deleted.response.statusCode === 200, `Delete problem returned HTTP ${deleted.response.statusCode}: ${JSON.stringify(deleted.response.body)}`);

  console.log('PASS: Problems create, list, read, update, and delete workflow works.');
  return problemId;
}

async function cleanup(testEmail: string, timestamp: number): Promise<void> {
  const tableRows = await prisma.$queryRaw<{ table_name: string }[]>`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name IN ('users', 'problems')
  `;
  const existingTables = new Set(tableRows.map((row) => row.table_name));

  if (existingTables.has('users')) {
    await prisma.$executeRaw`DELETE FROM users WHERE email = ${testEmail}`;
  }

  if (existingTables.has('problems')) {
    await prisma.$executeRaw`DELETE FROM problems WHERE slug IN (${`diagnostic-problem-${timestamp}`}, ${`diagnostic-problem-updated-${timestamp}`})`;
  }
}

async function runFullBackendDiagnostic(): Promise<void> {
  process.env.JWT_SECRET ||= 'diagnostic_test_secret';

  console.log('Launching backend smoke suite...\n');

  const timestamp = Date.now();
  const testEmail = `diagnostic_${timestamp}@test.com`;
  const testUsername = `tester_${timestamp}`;

  try {
    await validateDatabaseConnection();
    await validateRequiredSchema();
    await runAppFeatureTest();
    await runAuthFeatureTest(testEmail, testUsername);
    await runProblemsFeatureTest(timestamp);
    await cleanup(testEmail, timestamp);

    console.log('\nALL SERVER SMOKE TESTS PASSED.');
  } catch (error) {
    console.error('\nSERVER SMOKE TEST FAILED:');
    console.error(error);
    await cleanup(testEmail, timestamp).catch(() => undefined);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

runFullBackendDiagnostic();
