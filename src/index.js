import app from './app.js';
import config from './config/config.js';
import logger from './config/logger.js';
import { connectDB, closeDB } from './config/database.js';
import { closeRedis } from './config/redis.js';
import { closeQueues } from './queues/index.js';

// Import queue processors to start them
import './queues/processors/email.processor.js';
import './queues/processors/notification.processor.js';
import './queues/processors/order.processor.js';

let server;

/**
 * Start the server
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    server = app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} in ${config.env} mode`);
      logger.info(`API Documentation available at http://localhost:${config.port}/api-docs`);
      logger.info(`Health check available at http://localhost:${config.port}/health`);
      logger.info(`Metrics available at http://localhost:${config.port}/metrics`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

/**
 * Graceful shutdown handler
 */
const exitHandler = async () => {
  if (server) {
    logger.info('Shutting down server gracefully...');

    server.close(async () => {
      logger.info('HTTP server closed');

      try {
        await closeQueues();
        await closeRedis();
        await closeDB();
        logger.info('All connections closed successfully');
        process.exit(0);
      } catch (error) {
        logger.error('Error during graceful shutdown:', error);
        process.exit(1);
      }
    });

    // Force close after 30 seconds
    setTimeout(() => {
      logger.error('Forcing shutdown after timeout');
      process.exit(1);
    }, 30000);
  } else {
    process.exit(0);
  }
};

/**
 * Unexpected error handler
 */
const unexpectedErrorHandler = (error) => {
  logger.error('Unexpected error:', error);
  exitHandler();
};

// Handle uncaught errors
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

// Handle termination signals
process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  exitHandler();
});

process.on('SIGINT', () => {
  logger.info('SIGINT received');
  exitHandler();
});

// Start the server
startServer();

export default app;
