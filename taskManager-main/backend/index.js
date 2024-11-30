import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';

import authRouter from './routes/auth.js';
import taskRouter from './routes/task.js';

const app = express();
dotenv.config();
const port = process.env.PORT || 3000;
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: 'http://127.0.0.1:5500',
    credentials: true,
  })
);
app.use(cookieParser());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/tasks', taskRouter);

// errorHandler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(port, () => {
  console.log(`Server running on port http://localhost ${port}`);
});
