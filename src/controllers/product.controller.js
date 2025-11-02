import httpStatus from 'http-status';
import pick from '../utils/pick.js';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';
import * as productService from '../services/product.service.js';

const createProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(httpStatus.CREATED).send(product);
});

const getProducts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'category', 'isActive', 'isFeatured']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await productService.queryProducts(filter, options);
  res.send(result);
});

const getProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  res.send(product);
});

const getProductBySlug = catchAsync(async (req, res) => {
  const product = await productService.getProductBySlug(req.params.slug);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  res.send(product);
});

const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProductById(req.params.productId, req.body);
  res.send(product);
});

const deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProductById(req.params.productId);
  res.status(httpStatus.NO_CONTENT).send();
});

const searchProducts = catchAsync(async (req, res) => {
  const { q } = req.query;
  if (!q) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Search query is required');
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await productService.searchProducts(q, options);
  res.send(result);
});

const getProductsByCategory = catchAsync(async (req, res) => {
  const { category } = req.params;
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await productService.getProductsByCategory(category, options);
  res.send(result);
});

const getFeaturedProducts = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await productService.getFeaturedProducts(options);
  res.send(result);
});

export {
  createProduct,
  getProducts,
  getProduct,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsByCategory,
  getFeaturedProducts,
};
