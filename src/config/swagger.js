import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import config from './config.js';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Node.js Backend Template API',
    version: '1.0.0',
    description:
      'Professional, universal, production-ready Node.js backend template with comprehensive API documentation',
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
    contact: {
      name: 'API Support',
      email: 'support@example.com',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/api/v1`,
      description: 'Development server',
    },
    {
      url: 'https://api.yourapp.com/api/v1',
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    {
      name: 'Auth',
      description: 'Authentication and authorization endpoints',
    },
    {
      name: 'Users',
      description: 'User management endpoints',
    },
    {
      name: 'Products',
      description: 'Product CRUD operations',
    },
    {
      name: 'Orders',
      description: 'Order management',
    },
    {
      name: 'Payments',
      description: 'Payment processing with Stripe',
    },
    {
      name: 'Notifications',
      description: 'Email and push notifications',
    },
    {
      name: 'Static Pages',
      description: 'Terms, privacy policy, about page',
    },
    {
      name: 'Upload',
      description: 'File upload endpoints',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/v1/*.js', './src/models/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

/**
 * Setup Swagger documentation
 * @param {object} app - Express app instance
 */
const setupSwagger = (app) => {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'API Documentation',
    })
  );

  // Serve swagger spec as JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};

export { setupSwagger, swaggerSpec };
export default setupSwagger;
