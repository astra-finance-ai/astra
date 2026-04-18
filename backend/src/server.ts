import http from 'http';
import { createApp } from './app';
import { connectDB } from './config/db';
import { connectRedis } from './config/redis';
import { env } from './config/env';

const startServer = async () => {
  try {
    // Connect to database and cache
    await connectDB();
    await connectRedis();

    // Create Express app
    const app = createApp();

    // Create HTTP server
    const server = http.createServer(app);

    // Start server
    const PORT = env.PORT;
    server.listen(PORT, () => {
      console.log(`🚀 Astra Backend running on port ${PORT}`);
      console.log(`📝 Environment: ${env.NODE_ENV}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
      });
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      server.close(() => {
        process.exit(1);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
