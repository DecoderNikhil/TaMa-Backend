import 'dotenv/config';
import app from './app.js';
import pool from './config/db.js';

const PORT = process.env.PORT || 3000;

// pool.on('connect', () => {
//     await pool.query('SELECT 1');
//   console.log('PostgreSQL is connected!');
// });

app.get('/', async (req, res) => {
  await pool.query('SELECT 1');
  console.log('PostgreSQL is connected!');
  res.send('Hello TaMa!');
});

pool.on('error', (err) => {
  console.log(`PostgreSQL error: ${err}`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
