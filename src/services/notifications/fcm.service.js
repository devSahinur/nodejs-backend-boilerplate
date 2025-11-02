import admin from 'firebase-admin';
import config from '../../config/config.js';
import logger from '../../config/logger.js';
import ApiError from '../../utils/ApiError.js';
import httpStatus from 'http-status';

// Initialize Firebase Admin
let firebaseApp = null;

const initializeFirebase = () => {
  if (!firebaseApp && config.firebase.projectId && config.firebase.privateKey) {
    try {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: config.firebase.projectId,
          privateKey: config.firebase.privateKey,
          clientEmail: config.firebase.clientEmail,
        }),
      });
      logger.info('Firebase Admin initialized successfully');
    } catch (error) {
      logger.error('Firebase initialization failed:', error);
    }
  }
  return firebaseApp;
};

/**
 * Send push notification to a single device
 * @param {string} token - Device FCM token
 * @param {Object} notification - Notification data
 * @param {string} notification.title - Notification title
 * @param {string} notification.body - Notification body
 * @param {Object} notification.data - Additional data
 * @returns {Promise<string>}
 */
const sendPushNotification = async (token, { title, body, data = {} }) => {
  initializeFirebase();

  if (!firebaseApp) {
    throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, 'Firebase is not configured');
  }

  try {
    const message = {
      notification: {
        title,
        body,
      },
      data,
      token,
    };

    const response = await admin.messaging().send(message);
    logger.info(`Push notification sent successfully: ${response}`);
    return response;
  } catch (error) {
    logger.error('Failed to send push notification:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to send push notification');
  }
};

/**
 * Send push notification to multiple devices
 * @param {string[]} tokens - Array of device FCM tokens
 * @param {Object} notification - Notification data
 * @param {string} notification.title - Notification title
 * @param {string} notification.body - Notification body
 * @param {Object} notification.data - Additional data
 * @returns {Promise<Object>}
 */
const sendMulticastNotification = async (tokens, { title, body, data = {} }) => {
  initializeFirebase();

  if (!firebaseApp) {
    throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, 'Firebase is not configured');
  }

  try {
    const message = {
      notification: {
        title,
        body,
      },
      data,
      tokens,
    };

    const response = await admin.messaging().sendMulticast(message);
    logger.info(
      `Multicast notification sent: ${response.successCount} successful, ${response.failureCount} failed`
    );
    return response;
  } catch (error) {
    logger.error('Failed to send multicast notification:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to send notifications');
  }
};

/**
 * Send push notification to a topic
 * @param {string} topic - Topic name
 * @param {Object} notification - Notification data
 * @param {string} notification.title - Notification title
 * @param {string} notification.body - Notification body
 * @param {Object} notification.data - Additional data
 * @returns {Promise<string>}
 */
const sendTopicNotification = async (topic, { title, body, data = {} }) => {
  initializeFirebase();

  if (!firebaseApp) {
    throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, 'Firebase is not configured');
  }

  try {
    const message = {
      notification: {
        title,
        body,
      },
      data,
      topic,
    };

    const response = await admin.messaging().send(message);
    logger.info(`Topic notification sent successfully: ${response}`);
    return response;
  } catch (error) {
    logger.error('Failed to send topic notification:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to send topic notification');
  }
};

/**
 * Subscribe devices to a topic
 * @param {string[]} tokens - Array of device FCM tokens
 * @param {string} topic - Topic name
 * @returns {Promise<Object>}
 */
const subscribeToTopic = async (tokens, topic) => {
  initializeFirebase();

  if (!firebaseApp) {
    throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, 'Firebase is not configured');
  }

  try {
    const response = await admin.messaging().subscribeToTopic(tokens, topic);
    logger.info(`Subscribed ${response.successCount} devices to topic ${topic}`);
    return response;
  } catch (error) {
    logger.error('Failed to subscribe to topic:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to subscribe to topic');
  }
};

/**
 * Unsubscribe devices from a topic
 * @param {string[]} tokens - Array of device FCM tokens
 * @param {string} topic - Topic name
 * @returns {Promise<Object>}
 */
const unsubscribeFromTopic = async (tokens, topic) => {
  initializeFirebase();

  if (!firebaseApp) {
    throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, 'Firebase is not configured');
  }

  try {
    const response = await admin.messaging().unsubscribeFromTopic(tokens, topic);
    logger.info(`Unsubscribed ${response.successCount} devices from topic ${topic}`);
    return response;
  } catch (error) {
    logger.error('Failed to unsubscribe from topic:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to unsubscribe from topic');
  }
};

export {
  sendPushNotification,
  sendMulticastNotification,
  sendTopicNotification,
  subscribeToTopic,
  unsubscribeFromTopic,
};
