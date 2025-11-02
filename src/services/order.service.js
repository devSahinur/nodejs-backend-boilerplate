import httpStatus from 'http-status';
import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import ApiError from '../utils/ApiError.js';
import { addOrderJob } from '../queues/index.js';

/**
 * Create an order
 * @param {Object} orderBody
 * @param {ObjectId} userId
 * @returns {Promise<Order>}
 */
const createOrder = async (orderBody, userId) => {
  // Validate products and calculate totals
  const items = [];
  let subtotal = 0;

  for (const item of orderBody.items) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, `Product ${item.product} not found`);
    }
    if (product.stock < item.quantity) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Insufficient stock for ${product.name}`);
    }

    const itemPrice = product.price * item.quantity;
    subtotal += itemPrice;

    items.push({
      product: product._id,
      name: product.name,
      quantity: item.quantity,
      price: product.price,
      image: product.images[0]?.url,
    });

    // Update product stock
    product.stock -= item.quantity;
    await product.save();
  }

  const tax = subtotal * 0.1; // 10% tax
  const shippingCost = orderBody.shippingCost || 10;
  const totalAmount = subtotal + tax + shippingCost - (orderBody.discount || 0);

  const order = await Order.create({
    user: userId,
    items,
    shippingAddress: orderBody.shippingAddress,
    paymentMethod: orderBody.paymentMethod,
    subtotal,
    tax,
    shippingCost,
    discount: orderBody.discount || 0,
    totalAmount,
    paymentIntentId: orderBody.paymentIntentId,
    notes: orderBody.notes,
  });

  // Queue order confirmation email
  await addOrderJob({
    orderId: order._id,
    type: 'confirmation',
    priority: 10,
  });

  return order;
};

/**
 * Query for orders
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryOrders = async (filter, options) => {
  const orders = await Order.paginate(filter, options);
  return orders;
};

/**
 * Get order by id
 * @param {ObjectId} id
 * @returns {Promise<Order>}
 */
const getOrderById = async (id) => {
  return Order.findById(id).populate('user', 'fullName email');
};

/**
 * Get user orders
 * @param {ObjectId} userId
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const getUserOrders = async (userId, options) => {
  return Order.findByUser(userId, options);
};

/**
 * Update order status
 * @param {ObjectId} orderId
 * @param {string} status
 * @returns {Promise<Order>}
 */
const updateOrderStatus = async (orderId, status) => {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  order.status = status;

  if (status === 'delivered') {
    order.deliveredAt = new Date();
  } else if (status === 'cancelled') {
    order.cancelledAt = new Date();
    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }
  }

  await order.save();

  // Queue status update notification
  await addOrderJob({
    orderId: order._id,
    type: 'status_update',
    priority: 8,
  });

  return order;
};

/**
 * Cancel order
 * @param {ObjectId} orderId
 * @param {string} reason
 * @returns {Promise<Order>}
 */
const cancelOrder = async (orderId, reason) => {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  if (order.status === 'delivered' || order.status === 'cancelled') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot cancel this order');
  }

  order.status = 'cancelled';
  order.cancelReason = reason;
  order.cancelledAt = new Date();

  // Restore product stock
  for (const item of order.items) {
    const product = await Product.findById(item.product);
    if (product) {
      product.stock += item.quantity;
      await product.save();
    }
  }

  await order.save();
  return order;
};

/**
 * Get orders by status
 * @param {string} status
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const getOrdersByStatus = async (status, options) => {
  return Order.findByStatus(status, options);
};

export {
  createOrder,
  queryOrders,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  cancelOrder,
  getOrdersByStatus,
};
