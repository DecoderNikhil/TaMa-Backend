import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.ts';
import taskRoutes from './routes/taskRoutes.ts';

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello TaMa!');
});

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

export default app;
