import Queue from 'bull';
import config from '../config/config.js';
import logger from '../config/logger.js';
import { jobProcessingDuration } from '../config/metrics.js';

// Create queues
const emailQueue = new Queue('email', {
  redis: config.redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

const notificationQueue = new Queue('notification', {
  redis: config.redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

// Queue event handlers
const setupQueueEventHandlers = (queue, name) => {
  queue.on('completed', (job, result) => {
    logger.info(`${name} job ${job.id} completed`);
  });

  queue.on('failed', (job, err) => {
    logger.error(`${name} job ${job.id} failed:`, err);
  });

  queue.on('stalled', (job) => {
    logger.warn(`${name} job ${job.id} stalled`);
  });

  queue.on('error', (error) => {
    logger.error(`${name} queue error:`, error);
  });
};

setupQueueEventHandlers(emailQueue, 'Email');
setupQueueEventHandlers(notificationQueue, 'Notification');

/**
 * Process jobs with metrics
 * @param {Queue} queue - Bull queue
 * @param {Function} processor - Job processor function
 * @returns {void}
 */
const processWithMetrics = (queue, processor) => {
  queue.process(async (job) => {
    const startTime = Date.now();
    let status = 'success';

    try {
      await processor(job);
    } catch (error) {
      status = 'failed';
      throw error;
    } finally {
      const duration = (Date.now() - startTime) / 1000;
      jobProcessingDuration.observe(
        {
          job_name: queue.name,
          status,
        },
        duration
      );
    }
  });
};

/**
 * Add email job to queue
 * @param {Object} emailData - Email data
 * @returns {Promise<Object>}
 */
const addEmailJob = async (emailData) => {
  return emailQueue.add(emailData, {
    priority: emailData.priority || 5,
  });
};

/**
 * Add notification job to queue
 * @param {Object} notificationData - Notification data
 * @returns {Promise<Object>}
 */
const addNotificationJob = async (notificationData) => {
  return notificationQueue.add(notificationData, {
    priority: notificationData.priority || 5,
  });
};

/**
 * Gracefully close all queues
 * @returns {Promise<void>}
 */
const closeQueues = async () => {
  await Promise.all([emailQueue.close(), notificationQueue.close()]);
  logger.info('All queues closed');
};

export {
  emailQueue,
  notificationQueue,
  processWithMetrics,
  addEmailJob,
  addNotificationJob,
  closeQueues,
};
