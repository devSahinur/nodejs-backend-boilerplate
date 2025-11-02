import express from 'express';
import * as orderController from '../../controllers/order.controller.js';
import auth from '../../middlewares/auth.js';
import validate from '../../middlewares/validate.js';
import * as orderValidation from '../../validations/order.validation.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management and retrieval
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       "201":
 *         description: Created
 */
router
  .route('/')
  .post(auth(), validate(orderValidation.createOrder), orderController.createOrder)
  .get(auth('getOrders'), validate(orderValidation.getOrders), orderController.getOrders);

/**
 * @swagger
 * /orders/my-orders:
 *   get:
 *     summary: Get current user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 */
router.route('/my-orders').get(auth(), orderController.getMyOrders);

/**
 * @swagger
 * /orders/status/:status:
 *   get:
 *     summary: Get orders by status
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 */
router.route('/status/:status').get(auth('getOrders'), orderController.getOrdersByStatus);

/**
 * @swagger
 * /orders/:id:
 *   get:
 *     summary: Get an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 */
router.route('/:orderId').get(auth(), validate(orderValidation.getOrder), orderController.getOrder);

/**
 * @swagger
 * /orders/:id/status:
 *   patch:
 *     summary: Update order status
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 */
router
  .route('/:orderId/status')
  .patch(auth('manageOrders'), validate(orderValidation.updateOrderStatus), orderController.updateOrderStatus);

/**
 * @swagger
 * /orders/:id/cancel:
 *   post:
 *     summary: Cancel an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 */
router
  .route('/:orderId/cancel')
  .post(auth(), validate(orderValidation.cancelOrder), orderController.cancelOrder);

export default router;
