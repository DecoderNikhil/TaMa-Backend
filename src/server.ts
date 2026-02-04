import 'dotenv/config';
import app from './app.js';
import pool from './config/db.js';
import type { Server } from 'http';

const PORT = process.env.PORT || 3000;
let server: Server | undefined;

async function connect() {
  try {
    await pool.query('SELECT 1');
    console.log('PostgreSQL is ready!');

    server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('PostgreSQL error:', err.message);
    }
    process.exit(1);
  }
}

pool.on('error', (err: Error) => {
  console.error('PostgreSQL pool error:', err.message);
  process.exit(1);
});

function shutdown(signal: string) {
  console.log(`${signal} received. Shutting down...`);
  if (server) {
    server.close(() => process.exit(0));
  } else {
    process.exit(0);
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

connect();
