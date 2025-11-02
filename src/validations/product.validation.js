import Joi from 'joi';
import { objectId } from './custom.validation.js';

const createProduct = {
  body: Joi.object().keys({
    name: Joi.string().required().trim().min(1).max(255),
    description: Joi.string().required().trim().min(1).max(2000),
    price: Joi.number().required().positive().precision(2),
    category: Joi.string().required().trim().min(1).max(100),
    stock: Joi.number().required().integer().min(0),
    images: Joi.array().items(Joi.string().uri()).optional(),
    sku: Joi.string().optional().trim().max(100),
    weight: Joi.number().optional().positive(),
    dimensions: Joi.object()
      .keys({
        length: Joi.number().positive(),
        width: Joi.number().positive(),
        height: Joi.number().positive(),
      })
      .optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    isActive: Joi.boolean().optional(),
  }),
};

const getProducts = {
  query: Joi.object().keys({
    name: Joi.string().trim(),
    category: Joi.string().trim(),
    minPrice: Joi.number().min(0),
    maxPrice: Joi.number().min(0),
    tags: Joi.string().trim(),
    isActive: Joi.boolean(),
    sortBy: Joi.string(),
    limit: Joi.number().integer().min(1).max(100),
    page: Joi.number().integer().min(1),
  }),
};

const getProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId).required(),
  }),
};

const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().trim().min(1).max(255),
      description: Joi.string().trim().min(1).max(2000),
      price: Joi.number().positive().precision(2),
      category: Joi.string().trim().min(1).max(100),
      stock: Joi.number().integer().min(0),
      images: Joi.array().items(Joi.string().uri()),
      sku: Joi.string().trim().max(100),
      weight: Joi.number().positive(),
      dimensions: Joi.object().keys({
        length: Joi.number().positive(),
        width: Joi.number().positive(),
        height: Joi.number().positive(),
      }),
      tags: Joi.array().items(Joi.string()),
      isActive: Joi.boolean(),
    })
    .min(1),
};

const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId).required(),
  }),
};

export { createProduct, getProducts, getProduct, updateProduct, deleteProduct };
