import httpStatus from 'http-status';
import Product from '../models/product.model.js';
import ApiError from '../utils/ApiError.js';

/**
 * Create a product
 * @param {Object} productBody
 * @returns {Promise<Product>}
 */
const createProduct = async (productBody) => {
  return Product.create(productBody);
};

/**
 * Query for products
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryProducts = async (filter, options) => {
  const products = await Product.paginate(filter, options);
  return products;
};

/**
 * Get product by id
 * @param {ObjectId} id
 * @returns {Promise<Product>}
 */
const getProductById = async (id) => {
  return Product.findById(id);
};

/**
 * Get product by slug
 * @param {string} slug
 * @returns {Promise<Product>}
 */
const getProductBySlug = async (slug) => {
  return Product.findOne({ slug, isActive: true });
};

/**
 * Update product by id
 * @param {ObjectId} productId
 * @param {Object} updateBody
 * @returns {Promise<Product>}
 */
const updateProductById = async (productId, updateBody) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  Object.assign(product, updateBody);
  await product.save();
  return product;
};

/**
 * Delete product by id
 * @param {ObjectId} productId
 * @returns {Promise<Product>}
 */
const deleteProductById = async (productId) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  await product.remove();
  return product;
};

/**
 * Search products
 * @param {string} query - Search query
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const searchProducts = async (query, options) => {
  return Product.search(query, options);
};

/**
 * Get products by category
 * @param {string} category
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const getProductsByCategory = async (category, options) => {
  const filter = { category, isActive: true };
  return Product.paginate(filter, options);
};

/**
 * Get featured products
 * @param {Object} options
 * @returns {Promise<QueryResult>}
 */
const getFeaturedProducts = async (options) => {
  const filter = { isFeatured: true, isActive: true };
  return Product.paginate(filter, options);
};

/**
 * Update product stock
 * @param {ObjectId} productId
 * @param {number} quantity
 * @returns {Promise<Product>}
 */
const updateProductStock = async (productId, quantity) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  product.stock += quantity;
  await product.save();
  return product;
};

export default {
  createProduct,
  queryProducts,
  getProductById,
  getProductBySlug,
  updateProductById,
  deleteProductById,
  searchProducts,
  getProductsByCategory,
  getFeaturedProducts,
  updateProductStock,
};

export {
  createProduct,
  queryProducts,
  getProductById,
  getProductBySlug,
  updateProductById,
  deleteProductById,
  searchProducts,
  getProductsByCategory,
  getFeaturedProducts,
  updateProductStock,
};
