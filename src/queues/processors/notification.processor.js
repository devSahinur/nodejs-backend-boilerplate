import { notificationQueue, processWithMetrics } from '../index.js';
import { sendPushNotification } from '../../services/notifications/fcm.service.js';
import logger from '../../config/logger.js';

/**
 * Process notification jobs
 * @param {Object} job - Bull job
 * @returns {Promise<void>}
 */
const processNotificationJob = async (job) => {
  const { token, title, body, data } = job.data;

  logger.info(`Processing notification job ${job.id}`);

  try {
    await sendPushNotification(token, { title, body, data });
    logger.info(`Notification job ${job.id} completed successfully`);
  } catch (error) {
    logger.error(`Notification job ${job.id} failed:`, error);
    throw error;
  }
};

// Start processing
processWithMetrics(notificationQueue, processNotificationJob);

export default processNotificationJob;
