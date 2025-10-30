import { db } from '../lib/prisma.js';

async function testConnection() {
  try {
    // Test the connection by running a simple query
    const result = await db.$queryRaw`SELECT 1 + 1 AS result`;
    console.log('Database connection successful:', result);
  } catch (error) {
    console.error('Database connection failed:', error);
  } finally {
    await db.$disconnect();
  }
}

testConnection();