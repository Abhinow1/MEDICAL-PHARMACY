import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import apiRoutes from './routes/index.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';
import { apiLimiter } from './middleware/rateLimiter.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      if (process.env.CLIENT_URL) {
        const customOrigins = process.env.CLIENT_URL.split(',').map((o) => o.trim());
        if (customOrigins.includes(origin) || customOrigins.includes('*')) {
          return callback(null, true);
        }
      }
      callback(new Error('CORS policy: Not allowed by CORS'));
    },
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploaded prescriptions and product images
const uploadsDir = path.resolve('uploads');
app.use('/uploads', express.static(uploadsDir));

// Rate limiting on API routes
app.use('/api', apiLimiter);

// Mount API routes
app.use('/api', apiRoutes);

// In production or when client/dist exists, serve frontend static build
const clientDistPath = path.resolve(__dirname, '../client/dist');
if (fs.existsSync(path.join(clientDistPath, 'index.html'))) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
