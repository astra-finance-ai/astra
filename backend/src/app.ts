import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';

import { authRoutes } from './routes/auth.routes';
import { userRoutes } from './routes/user.routes';
import { assetRoutes } from './routes/asset.routes';
import { investmentRoutes } from './routes/investment.routes';
import { notificationRoutes } from './routes/notification.routes';

import { apiLimiter, authLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { requestLogger } from './middleware/requestLogger';

export const createApp = (): Application => {
  const app = express();

  // Security headers
  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      credentials: true,
    })
  );
  app.use(hpp()); // Prevent HTTP parameter pollution
  app.use(mongoSanitize()); // Prevent NoSQL injection

  // Body parsing
  app.use(express.json({ limit: '10kb' })); // Limit body size
  app.use(express.urlencoded({ extended: true }));

  // Logging
  app.use(morgan('combined', { stream: requestLogger }));

  // Rate limiting
  app.use('/api/', apiLimiter);
  app.use('/api/auth/', authLimiter);

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/assets', assetRoutes);
  app.use('/api/investments', investmentRoutes);
  app.use('/api/notifications', notificationRoutes);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Error handling
  app.use(notFound);
  app.use(errorHandler);

  return app;
};
