import httpStatus from 'http-status';
import pick from '../utils/pick.js';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';
import * as orderService from '../services/order.service.js';

const createOrder = catchAsync(async (req, res) => {
  const order = await orderService.createOrder(req.body, req.user._id);
  res.status(httpStatus.CREATED).send(order);
});

const getOrders = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status', 'paymentStatus']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
  const result = await orderService.queryOrders(filter, options);
  res.send(result);
});

const getOrder = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(req.params.orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  res.send(order);
});

const getMyOrders = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await orderService.getUserOrders(req.user._id, options);
  res.send(result);
});

const updateOrderStatus = catchAsync(async (req, res) => {
  const order = await orderService.updateOrderStatus(req.params.orderId, req.body.status);
  res.send(order);
});

const cancelOrder = catchAsync(async (req, res) => {
  const order = await orderService.cancelOrder(req.params.orderId, req.body.reason);
  res.send(order);
});

const getOrdersByStatus = catchAsync(async (req, res) => {
  const { status } = req.params;
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await orderService.getOrdersByStatus(status, options);
  res.send(result);
});

export default { createOrder, getOrders, getOrder, getMyOrders, updateOrderStatus, cancelOrder, getOrdersByStatus };

export { createOrder, getOrders, getOrder, getMyOrders, updateOrderStatus, cancelOrder, getOrdersByStatus };
