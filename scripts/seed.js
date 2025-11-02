import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import config from '../src/config/config.js';
import logger from '../src/config/logger.js';
import User from '../src/models/user.model.js';
import Product from '../src/models/product.model.js';
import Order from '../src/models/order.model.js';

/**
 * Seed users
 */
const seedUsers = async () => {
  const users = [
    {
      fullName: 'Admin User',
      email: 'admin@example.com',
      password: await bcrypt.hash('Admin123!', 8),
      role: 'admin',
      isEmailVerified: true,
      isActive: true,
    },
    {
      fullName: 'John Doe',
      email: 'john@example.com',
      password: await bcrypt.hash('User123!', 8),
      role: 'user',
      isEmailVerified: true,
      isActive: true,
      phoneNumber: '+1234567890',
      address: '123 Main St, New York, NY 10001',
    },
    {
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      password: await bcrypt.hash('User123!', 8),
      role: 'user',
      isEmailVerified: true,
      isActive: true,
      phoneNumber: '+1234567891',
      address: '456 Oak Ave, Los Angeles, CA 90001',
    },
  ];

  await User.insertMany(users);
  logger.info(`Seeded ${users.length} users`);
  return users;
};

/**
 * Seed products
 */
const seedProducts = async () => {
  const products = [
    {
      name: 'Laptop Pro 15',
      description: 'High-performance laptop with 15-inch display, perfect for professionals',
      price: 1299.99,
      compareAtPrice: 1499.99,
      category: 'Electronics',
      subcategory: 'Computers',
      stock: 50,
      sku: 'LAP-PRO-15',
      images: [
        {
          url: 'https://via.placeholder.com/400',
          alt: 'Laptop Pro 15',
        },
      ],
      tags: ['laptop', 'electronics', 'computer'],
      isActive: true,
      isFeatured: true,
      rating: 4.5,
      reviewCount: 128,
    },
    {
      name: 'Wireless Headphones',
      description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
      price: 199.99,
      category: 'Electronics',
      subcategory: 'Audio',
      stock: 100,
      sku: 'HEAD-WL-001',
      images: [
        {
          url: 'https://via.placeholder.com/400',
          alt: 'Wireless Headphones',
        },
      ],
      tags: ['headphones', 'audio', 'wireless'],
      isActive: true,
      isFeatured: true,
      rating: 4.8,
      reviewCount: 256,
    },
    {
      name: 'Smart Watch Ultra',
      description: 'Advanced fitness tracking smartwatch with GPS and heart rate monitor',
      price: 399.99,
      category: 'Electronics',
      subcategory: 'Wearables',
      stock: 75,
      sku: 'WATCH-UL-001',
      images: [
        {
          url: 'https://via.placeholder.com/400',
          alt: 'Smart Watch Ultra',
        },
      ],
      tags: ['smartwatch', 'fitness', 'wearable'],
      isActive: true,
      isFeatured: false,
      rating: 4.6,
      reviewCount: 89,
    },
    {
      name: 'Portable Charger 20000mAh',
      description: 'High-capacity portable power bank with fast charging support',
      price: 49.99,
      category: 'Electronics',
      subcategory: 'Accessories',
      stock: 200,
      sku: 'CHRG-PORT-20K',
      images: [
        {
          url: 'https://via.placeholder.com/400',
          alt: 'Portable Charger',
        },
      ],
      tags: ['charger', 'power bank', 'accessories'],
      isActive: true,
      isFeatured: false,
      rating: 4.4,
      reviewCount: 342,
    },
    {
      name: '4K Action Camera',
      description: 'Waterproof action camera with 4K video recording and image stabilization',
      price: 299.99,
      category: 'Electronics',
      subcategory: 'Cameras',
      stock: 30,
      sku: 'CAM-ACT-4K',
      images: [
        {
          url: 'https://via.placeholder.com/400',
          alt: '4K Action Camera',
        },
      ],
      tags: ['camera', 'action', '4k', 'waterproof'],
      isActive: true,
      isFeatured: true,
      rating: 4.7,
      reviewCount: 156,
    },
  ];

  await Product.insertMany(products);
  logger.info(`Seeded ${products.length} products`);
  return products;
};

/**
 * Main seed function
 */
const seed = async () => {
  try {
    // Connect to database
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    logger.info('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    logger.info('Cleared existing data');

    // Seed data
    await seedUsers();
    await seedProducts();

    logger.info('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed
seed();
