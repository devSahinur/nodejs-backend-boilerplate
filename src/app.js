import express from 'express';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import cors from 'cors';
import passport from 'passport';
import httpStatus from 'http-status';
import config from './config/config.js';
import { successHandler, errorHandler } from './config/morgan.js';
import { jwtStrategy } from './config/passport.js';
import authLimiter from './middlewares/rateLimiter.js';
import routes from './routes/v1/index.js';
import { errorConverter, errorHandler as errorHandlerMiddleware } from './middlewares/error.js';
import ApiError from './utils/ApiError.js';
import { setupSwagger } from './config/swagger.js';
import { metricsMiddleware, register } from './config/metrics.js';

const app = express();

// Logging middleware
if (config.env !== 'test') {
  app.use(successHandler);
  app.use(errorHandler);
}

// Metrics middleware
app.use(metricsMiddleware);

// Static files
app.use(express.static('public'));

// Set security HTTP headers
app.use(helmet());

// Parse json request body
app.use(express.json());

// Parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Sanitize request data
app.use(xss());
app.use(mongoSanitize());

// Gzip compression
app.use(compression());

// Enable cors
app.use(cors());
app.options('*', cors());

// JWT authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// Limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/api/v1/auth', authLimiter);
}

// Setup Swagger documentation
setupSwagger(app);

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    res.status(500).end(error);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.env,
  });
});

// API v1 routes
app.use('/api/v1', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Node.js Backend Template API',
    version: '1.0.0',
    documentation: '/api-docs',
    health: '/health',
    metrics: '/metrics',
  });
});

// Send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Route not found'));
});

// Convert error to ApiError, if needed
app.use(errorConverter);

// Handle error
app.use(errorHandlerMiddleware);

export default app;
