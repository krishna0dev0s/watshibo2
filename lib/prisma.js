import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

export const db = globalForPrisma.prisma || new PrismaClient({
  log: ['warn', 'error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

// Attach helpful logging and a simple reconnect retry on startup to handle transient
// server-side restarts / admin-terminated connections (E57P01). This won't fix
// server-side interruptions (you'll need to check the DB provider), but it makes
// the app more resilient and logs clearer.
async function connectWithRetry(client, retries = 5, delayMs = 2000) {
  try {
    await client.$connect();
    console.log('Prisma: connected to database');
  } catch (err) {
    console.error(`Prisma: connect failed (${retries} retries left):`, err.message || err);
    if (retries <= 0) {
      console.error('Prisma: exhausted retries, giving up for now');
      return;
    }
    await new Promise((r) => setTimeout(r, delayMs));
    return connectWithRetry(client, retries - 1, Math.round(delayMs * 1.5));
  }
}

// Start initial connect attempt in background during dev to improve error messages
// and avoid noisy stack traces when the DB provider restarts connections.
connectWithRetry(db).catch((e) => console.error('Prisma: unexpected connect error', e));

// Avoid re-registering listeners during hot-reload / module re-evaluation in dev.
// Use a global flag stored on the shared `globalForPrisma` object.
if (!globalForPrisma.__prismaEventHandlersInstalled) {
  db.$on('error', (e) => {
    console.error('Prisma client error event:', e);
  });

  // Prisma 5+ uses the library engine which doesn't support the client-level
  // 'beforeExit' event. Register a process-level handler instead so we can
  // disconnect the client cleanly when Node is exiting.
  process.on('beforeExit', async () => {
    try {
      await db.$disconnect();
      console.log('Prisma: disconnected on process beforeExit');
    } catch (e) {
      console.error('Prisma: error disconnecting on process beforeExit', e);
    }
  });

  globalForPrisma.__prismaEventHandlersInstalled = true;
}