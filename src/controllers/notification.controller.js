import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync.js';
import * as fcmService from '../services/notifications/fcm.service.js';
import { addEmailJob, addNotificationJob } from '../queues/index.js';

const sendEmail = catchAsync(async (req, res) => {
  const { to, subject, text, html } = req.body;
  await addEmailJob({ to, subject, text, html, priority: 10 });
  res.status(httpStatus.OK).send({ message: 'Email queued successfully' });
});

const sendPushNotification = catchAsync(async (req, res) => {
  const { token, title, body, data } = req.body;
  const result = await fcmService.sendPushNotification(token, { title, body, data });
  res.status(httpStatus.OK).send(result);
});

const sendMulticastNotification = catchAsync(async (req, res) => {
  const { tokens, title, body, data } = req.body;
  const result = await fcmService.sendMulticastNotification(tokens, { title, body, data });
  res.status(httpStatus.OK).send(result);
});

const sendTopicNotification = catchAsync(async (req, res) => {
  const { topic, title, body, data } = req.body;
  const result = await fcmService.sendTopicNotification(topic, { title, body, data });
  res.status(httpStatus.OK).send(result);
});

const subscribeToTopic = catchAsync(async (req, res) => {
  const { tokens, topic } = req.body;
  const result = await fcmService.subscribeToTopic(tokens, topic);
  res.status(httpStatus.OK).send(result);
});

const unsubscribeFromTopic = catchAsync(async (req, res) => {
  const { tokens, topic } = req.body;
  const result = await fcmService.unsubscribeFromTopic(tokens, topic);
  res.status(httpStatus.OK).send(result);
});

export default {
  sendEmail,
  sendPushNotification,
  sendMulticastNotification,
  sendTopicNotification,
  subscribeToTopic,
  unsubscribeFromTopic,
};

export {
  sendEmail,
  sendPushNotification,
  sendMulticastNotification,
  sendTopicNotification,
  subscribeToTopic,
  unsubscribeFromTopic,
};
