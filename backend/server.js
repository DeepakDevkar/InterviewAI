import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';
import { initializeSocket } from './config/socket.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';
import { logger } from './utils/logger.js';
import apiRouter from './routes/index.js';

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initializeSocket(server);

// Middleware
app.use(helmet());
app.use(compression()); // Gzip payload compressor

// API Rate Limit Rules
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // max 100 requests per IP
  message: 'Too many API requests, please try again in 15 minutes.'
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // strict 20 limits for login actions
  message: 'Security Guard: Brute-force block. Stricter login attempts limit reached. Try in 15 minutes.'
});

app.use('/api', generalLimiter);
app.use('/api/v1/auth', authLimiter);

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Mounting API Routes
app.use('/api/v1', apiRouter);

// Health Check API
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'InterviewAI API is healthy' });
});

// Centralized error handler middleware
app.use(errorMiddleware);

import { seedCodingChallenges } from './utils/seedChallenges.js';

// Connect to Database and start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await seedCodingChallenges();
    server.listen(PORT, () => {
      logger.info(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
