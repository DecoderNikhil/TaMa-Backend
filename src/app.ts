import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();

app.use(
  cors({
    origin: process.env.PRODUCTION_ORIGIN,
    credentials: true,
  }),
);
app.use(helmet());
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello TaMa!');
});

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);

  const status = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Something went wrong'
      : err.message;

  res.status(status).json({ message });
});

export default app;
