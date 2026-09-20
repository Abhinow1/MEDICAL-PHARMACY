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
    contentSecurityPolicy: false,
  })
);

// CORS configuration - Allow storefront access across web, mobile, and cloud environments
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow all origins (browser storefront, mobile apps, curl, tunnels, Vercel, Render)
      return callback(null, true);
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
