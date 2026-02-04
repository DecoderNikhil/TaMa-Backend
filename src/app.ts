import express from 'express';
import morgan from 'morgan';

const app = express();

// app.get('/', (req, res) => {
// });
app.use(morgan('dev'));

export default app;
