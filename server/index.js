import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import questRoutes from './routes/questRoutes.js';
import shopRoutes from './routes/shopRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Eagerly connect locally or initialize connection
connectDB().catch((err) => {
  console.error('Initial DB connection attempt failed:', err.message);
});

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database connection middleware for Serverless invocations
app.use(async (req, res, next) => {
  if (req.path === '/api/health') return next();
  try {
    await connectDB();
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Database connection error: ${err.message}. Please verify MONGODB_URI on Vercel and MongoDB Atlas Network Access (0.0.0.0/0).`,
    });
  }
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    app: 'Life RPG API',
    aesthetic: 'Constructivist Bauhaus Edition',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/quests', questRoutes);
app.use('/api/shop', shopRoutes);

app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found`,
  });
});

app.use(errorHandler);

// Only listen on port when not running as a Vercel Serverless Function
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`✨ Life RPG API running on http://localhost:${PORT}`);
    console.log(`🍵 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

export default app;
