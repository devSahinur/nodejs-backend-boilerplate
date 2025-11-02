import mongoose from 'mongoose';
import config from './config.js';
import logger from './logger.js';

/**
 * Connect to MongoDB
 */
const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

/**
 * Gracefully close MongoDB connection
 */
const closeDB = async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
  } catch (error) {
    logger.error('Error closing MongoDB connection:', error);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  logger.info('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  logger.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('Mongoose disconnected');
});

export { connectDB, closeDB };
export default connectDB;
