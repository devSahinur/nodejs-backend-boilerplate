import express from 'express';
import * as productController from '../../controllers/product.controller.js';
import auth from '../../middlewares/auth.js';
import validate from '../../middlewares/validate.js';
import * as productValidation from '../../validations/product.validation.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management and retrieval
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router
  .route('/')
  .post(auth('manageProducts'), validate(productValidation.createProduct), productController.createProduct)
  .get(validate(productValidation.getProducts), productController.getProducts);

/**
 * @swagger
 * /products/search:
 *   get:
 *     summary: Search products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       "200":
 *         description: OK
 */
router.route('/search').get(productController.searchProducts);

/**
 * @swagger
 * /products/featured:
 *   get:
 *     summary: Get featured products
 *     tags: [Products]
 *     responses:
 *       "200":
 *         description: OK
 */
router.route('/featured').get(productController.getFeaturedProducts);

/**
 * @swagger
 * /products/category/:category:
 *   get:
 *     summary: Get products by category
 *     tags: [Products]
 *     responses:
 *       "200":
 *         description: OK
 */
router.route('/category/:category').get(productController.getProductsByCategory);

/**
 * @swagger
 * /products/slug/:slug:
 *   get:
 *     summary: Get product by slug
 *     tags: [Products]
 *     responses:
 *       "200":
 *         description: OK
 */
router.route('/slug/:slug').get(productController.getProductBySlug);

/**
 * @swagger
 * /products/:id:
 *   get:
 *     summary: Get a product
 *     tags: [Products]
 *     responses:
 *       "200":
 *         description: OK
 *   patch:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "204":
 *         description: No content
 */
router
  .route('/:productId')
  .get(validate(productValidation.getProduct), productController.getProduct)
  .patch(auth('manageProducts'), validate(productValidation.updateProduct), productController.updateProduct)
  .delete(auth('manageProducts'), validate(productValidation.deleteProduct), productController.deleteProduct);

export default router;
