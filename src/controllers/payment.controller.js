import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync.js';
import * as stripeService from '../services/payments/stripe.service.js';

const createPaymentIntent = catchAsync(async (req, res) => {
  const { amount, currency, metadata } = req.body;
  const result = await stripeService.createPaymentIntent({ amount, currency, metadata });
  res.status(httpStatus.CREATED).send(result);
});

const getPaymentIntent = catchAsync(async (req, res) => {
  const { paymentIntentId } = req.params;
  const paymentIntent = await stripeService.getPaymentIntent(paymentIntentId);
  res.send(paymentIntent);
});

const createRefund = catchAsync(async (req, res) => {
  const { paymentIntentId } = req.params;
  const { amount } = req.body;
  const refund = await stripeService.createRefund(paymentIntentId, amount);
  res.send(refund);
});

const handleWebhook = catchAsync(async (req, res) => {
  const signature = req.headers['stripe-signature'];
  const event = stripeService.constructWebhookEvent(req.body, signature);
  await stripeService.handleWebhookEvent(event);
  res.status(httpStatus.OK).send({ received: true });
});

export { createPaymentIntent, getPaymentIntent, createRefund, handleWebhook };
