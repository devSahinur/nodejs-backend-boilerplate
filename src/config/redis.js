import Redis from 'ioredis';
import config from './config.js';
import logger from './logger.js';

/**
 * Create Redis client
 */
const redisClient = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

redisClient.on('connect', () => {
  logger.info('Redis client connected');
});

redisClient.on('error', (err) => {
  logger.error('Redis client error:', err);
});

redisClient.on('reconnecting', () => {
  logger.warn('Redis client reconnecting');
});

/**
 * Gracefully close Redis connection
 */
const closeRedis = async () => {
  try {
    await redisClient.quit();
    logger.info('Redis connection closed');
  } catch (error) {
    logger.error('Error closing Redis connection:', error);
  }
};

export { redisClient, closeRedis };
export default redisClient;
