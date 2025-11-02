import Joi from 'joi';
import { objectId } from './custom.validation.js';

const createOrder = {
  body: Joi.object().keys({
    items: Joi.array()
      .items(
        Joi.object().keys({
          productId: Joi.string().custom(objectId).required(),
          quantity: Joi.number().integer().positive().required(),
          price: Joi.number().positive().precision(2).required(),
        })
      )
      .min(1)
      .required(),
    shippingAddress: Joi.object()
      .keys({
        fullName: Joi.string().required().trim().min(1).max(255),
        street: Joi.string().required().trim().min(1).max(255),
        city: Joi.string().required().trim().min(1).max(100),
        state: Joi.string().required().trim().min(1).max(100),
        zipCode: Joi.string().required().trim().min(1).max(20),
        country: Joi.string().required().trim().min(1).max(100),
        phoneNumber: Joi.string().required().trim(),
      })
      .required(),
    billingAddress: Joi.object()
      .keys({
        fullName: Joi.string().trim().min(1).max(255),
        street: Joi.string().trim().min(1).max(255),
        city: Joi.string().trim().min(1).max(100),
        state: Joi.string().trim().min(1).max(100),
        zipCode: Joi.string().trim().min(1).max(20),
        country: Joi.string().trim().min(1).max(100),
        phoneNumber: Joi.string().trim(),
      })
      .optional(),
    paymentMethod: Joi.string()
      .required()
      .valid('credit_card', 'debit_card', 'paypal', 'stripe', 'bank_transfer'),
    totalAmount: Joi.number().positive().precision(2).required(),
    shippingCost: Joi.number().min(0).precision(2).optional(),
    taxAmount: Joi.number().min(0).precision(2).optional(),
    discountAmount: Joi.number().min(0).precision(2).optional(),
    notes: Joi.string().trim().max(1000).optional(),
    isExpressShipping: Joi.boolean().optional(),
  }),
};

const getOrders = {
  query: Joi.object().keys({
    status: Joi.string().valid('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),
    userId: Joi.string().custom(objectId),
    minAmount: Joi.number().min(0),
    maxAmount: Joi.number().min(0),
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso(),
    paymentMethod: Joi.string().valid('credit_card', 'debit_card', 'paypal', 'stripe', 'bank_transfer'),
    sortBy: Joi.string(),
    limit: Joi.number().integer().min(1).max(100),
    page: Joi.number().integer().min(1),
  }),
};

const getOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId).required(),
  }),
};

const updateOrderStatus = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    status: Joi.string()
      .required()
      .valid('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),
    trackingNumber: Joi.string().trim().optional(),
    notes: Joi.string().trim().max(1000).optional(),
  }),
};

const cancelOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    reason: Joi.string().trim().max(500).optional(),
    refundMethod: Joi.string()
      .optional()
      .valid('original_payment_method', 'store_credit', 'bank_transfer'),
  }),
};

export { createOrder, getOrders, getOrder, updateOrderStatus, cancelOrder };
