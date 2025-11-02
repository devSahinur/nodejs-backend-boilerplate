import { orderQueue, processWithMetrics } from '../index.js';
import { sendOrderConfirmationEmail } from '../../services/notifications/email.service.js';
import Order from '../../models/order.model.js';
import User from '../../models/user.model.js';
import logger from '../../config/logger.js';

/**
 * Process order jobs
 * @param {Object} job - Bull job
 * @returns {Promise<void>}
 */
const processOrderJob = async (job) => {
  const { orderId, type } = job.data;

  logger.info(`Processing order job ${job.id} for order ${orderId}`);

  try {
    const order = await Order.findById(orderId).populate('user');
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    switch (type) {
      case 'confirmation':
        await sendOrderConfirmationEmail(order.user.email, order);
        break;
      case 'status_update':
        // Handle order status update notifications
        logger.info(`Order ${orderId} status updated to ${order.status}`);
        break;
      default:
        logger.warn(`Unknown order job type: ${type}`);
    }

    logger.info(`Order job ${job.id} completed successfully`);
  } catch (error) {
    logger.error(`Order job ${job.id} failed:`, error);
    throw error;
  }
};

// Start processing
processWithMetrics(orderQueue, processOrderJob);

export default processOrderJob;
