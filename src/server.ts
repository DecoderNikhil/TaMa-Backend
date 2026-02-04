import 'dotenv/config';
import app from './app.js';
import pool from './config/db.js';

const PORT = process.env.PORT || 3000;

async function connect() {
  try {
    await pool.query('SELECT 1');
    console.log('PostgreSQL is ready!');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err: any) {
    console.log(`PostgreSQL error: ${err}`);
    process.exit(1);
  }
}

pool.on('error', (err: any) => {
  console.log(`PostgreSQL error: ${err}`);
  process.exit(1);
});

connect();
