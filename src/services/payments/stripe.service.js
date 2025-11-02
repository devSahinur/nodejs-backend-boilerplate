import Stripe from 'stripe';
import config from '../../config/config.js';
import logger from '../../config/logger.js';
import ApiError from '../../utils/ApiError.js';
import httpStatus from 'http-status';
import Order from '../../models/order.model.js';

const stripe = new Stripe(config.stripe.secretKey);

/**
 * Create a payment intent
 * @param {Object} paymentData - Payment data
 * @param {number} paymentData.amount - Amount in cents
 * @param {string} paymentData.currency - Currency code
 * @param {Object} paymentData.metadata - Additional metadata
 * @returns {Promise<Object>}
 */
const createPaymentIntent = async ({ amount, currency = 'usd', metadata = {} }) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    logger.error('Stripe payment intent creation failed:', error);
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create payment intent');
  }
};

/**
 * Confirm a payment intent
 * @param {string} paymentIntentId - Payment intent ID
 * @returns {Promise<Object>}
 */
const confirmPaymentIntent = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    logger.error('Stripe payment confirmation failed:', error);
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to confirm payment');
  }
};

/**
 * Retrieve a payment intent
 * @param {string} paymentIntentId - Payment intent ID
 * @returns {Promise<Object>}
 */
const getPaymentIntent = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    logger.error('Failed to retrieve payment intent:', error);
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment intent not found');
  }
};

/**
 * Create a refund
 * @param {string} paymentIntentId - Payment intent ID
 * @param {number} amount - Amount to refund (optional, full refund if not provided)
 * @returns {Promise<Object>}
 */
const createRefund = async (paymentIntentId, amount) => {
  try {
    const refundData = { payment_intent: paymentIntentId };
    if (amount) {
      refundData.amount = Math.round(amount * 100);
    }

    const refund = await stripe.refunds.create(refundData);
    return refund;
  } catch (error) {
    logger.error('Stripe refund failed:', error);
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to process refund');
  }
};

/**
 * Handle Stripe webhook events
 * @param {Object} event - Stripe webhook event
 * @returns {Promise<void>}
 */
const handleWebhookEvent = async (event) => {
  logger.info(`Handling Stripe webhook event: ${event.type}`);

  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSuccess(event.data.object);
      break;
    case 'payment_intent.payment_failed':
      await handlePaymentFailure(event.data.object);
      break;
    case 'charge.refunded':
      await handleRefund(event.data.object);
      break;
    default:
      logger.warn(`Unhandled event type: ${event.type}`);
  }
};

/**
 * Handle successful payment
 * @param {Object} paymentIntent - Payment intent object
 * @returns {Promise<void>}
 */
const handlePaymentSuccess = async (paymentIntent) => {
  try {
    const order = await Order.findOne({ paymentIntentId: paymentIntent.id });
    if (order) {
      order.paymentStatus = 'paid';
      order.status = 'processing';
      await order.save();
      logger.info(`Order ${order.orderNumber} payment confirmed`);
    }
  } catch (error) {
    logger.error('Error handling payment success:', error);
  }
};

/**
 * Handle failed payment
 * @param {Object} paymentIntent - Payment intent object
 * @returns {Promise<void>}
 */
const handlePaymentFailure = async (paymentIntent) => {
  try {
    const order = await Order.findOne({ paymentIntentId: paymentIntent.id });
    if (order) {
      order.paymentStatus = 'failed';
      await order.save();
      logger.info(`Order ${order.orderNumber} payment failed`);
    }
  } catch (error) {
    logger.error('Error handling payment failure:', error);
  }
};

/**
 * Handle refund
 * @param {Object} charge - Charge object
 * @returns {Promise<void>}
 */
const handleRefund = async (charge) => {
  try {
    const order = await Order.findOne({ paymentIntentId: charge.payment_intent });
    if (order) {
      order.paymentStatus = 'refunded';
      order.status = 'cancelled';
      await order.save();
      logger.info(`Order ${order.orderNumber} refunded`);
    }
  } catch (error) {
    logger.error('Error handling refund:', error);
  }
};

/**
 * Construct webhook event from request
 * @param {Buffer} payload - Request body
 * @param {string} signature - Stripe signature header
 * @returns {Object}
 */
const constructWebhookEvent = (payload, signature) => {
  try {
    return stripe.webhooks.constructEvent(payload, signature, config.stripe.webhookSecret);
  } catch (error) {
    logger.error('Webhook signature verification failed:', error);
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid webhook signature');
  }
};

export {
  createPaymentIntent,
  confirmPaymentIntent,
  getPaymentIntent,
  createRefund,
  handleWebhookEvent,
  constructWebhookEvent,
};
