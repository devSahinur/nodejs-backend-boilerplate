# Node.js Backend Boilerplate

A **professional, universal, production-ready Node.js backend boilerplate** built with Express, MongoDB, Redis, and comprehensive features to power any application (SaaS, e-commerce, blog, etc.).

[![CI/CD](https://github.com/devSahinur/nodejs-backend-boilerplate/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/devSahinur/nodejs-backend-boilerplate/actions)
[![codecov](https://codecov.io/gh/devSahinur/nodejs-backend-boilerplate/branch/main/graph/badge.svg)](https://codecov.io/gh/devSahinur/nodejs-backend-boilerplate)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Option 1: Using Docker (Recommended)](#option-1-using-docker-recommended)
  - [Option 2: Manual Installation](#option-2-manual-installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Database](#database)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Troubleshooting](#troubleshooting)

## Features

### Core Features
- ✅ **RESTful API** with Express.js
- ✅ **MongoDB** database with Mongoose ODM
- ✅ **Redis** for caching and queues
- ✅ **JWT Authentication** with access & refresh tokens
- ✅ **Role-based Access Control (RBAC)**
- ✅ **Input Validation** with Joi
- ✅ **ES Modules** (import/export)

### Business Features
- 💳 **Stripe Payment Integration** with webhooks
- 🔔 **Email Notifications** (Nodemailer)
- 📱 **Push Notifications** (Firebase Cloud Messaging)
- 🛍️ **Product Management** with search & categories
- 📦 **Order Management** with status tracking
- 📄 **Static Pages** (Terms, Privacy, About)
- 📤 **File Upload** with Multer

### DevOps & Infrastructure
- 🐳 **Docker** & **Docker Compose** support
- 🔄 **Bull Queues** for background jobs
- 📊 **Prometheus Metrics** endpoint
- 📝 **Swagger/OpenAPI Documentation**
- 🧪 **Jest** testing with Supertest
- 🔍 **ESLint** & **Prettier** for code quality
- 🪝 **Husky** pre-commit hooks
- 🚀 **GitHub Actions CI/CD** pipeline
- 🔒 **Security best practices** (Helmet, XSS, Rate limiting)

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required

1. **Node.js (>= 18.0.0)**
   - **macOS**:
     ```bash
     brew install node@18
     ```
   - **Windows**: Download from [nodejs.org](https://nodejs.org/)
   - **Linux (Ubuntu/Debian)**:
     ```bash
     curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
     sudo apt-get install -y nodejs
     ```

2. **npm (>= 9.0.0)** - Comes with Node.js
   ```bash
   node --version   # Should be >= 18.0.0
   npm --version    # Should be >= 9.0.0
   ```

### For Manual Installation (Option 2)

3. **MongoDB (>= 5.0)**
   - **macOS**:
     ```bash
     brew tap mongodb/brew
     brew install mongodb-community@7.0
     brew services start mongodb-community@7.0
     ```
   - **Windows**: Download from [mongodb.com](https://www.mongodb.com/try/download/community)
   - **Linux (Ubuntu/Debian)**:
     ```bash
     wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
     echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
     sudo apt-get update
     sudo apt-get install -y mongodb-org
     sudo systemctl start mongod
     ```

4. **Redis (>= 6.0)** - Optional but recommended
   - **macOS**:
     ```bash
     brew install redis
     brew services start redis
     ```
   - **Windows**: Download from [redis.io](https://redis.io/download) or use Docker
   - **Linux (Ubuntu/Debian)**:
     ```bash
     sudo apt-get update
     sudo apt-get install redis-server
     sudo systemctl start redis-server
     ```

### For Docker Installation (Option 1)

5. **Docker Desktop**
   - **macOS/Windows**: Download from [docker.com](https://www.docker.com/products/docker-desktop)
   - **Linux**:
     ```bash
     curl -fsSL https://get.docker.com -o get-docker.sh
     sh get-docker.sh
     sudo systemctl start docker
     ```

6. **Docker Compose** - Comes with Docker Desktop, or install separately:
   ```bash
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

## Installation

### Option 1: Using Docker (Recommended)

This is the **easiest way** to get started. Docker will handle MongoDB, Redis, and the application automatically.

1. **Clone the repository**
   ```bash
   git clone https://github.com/devSahinur/nodejs-backend-boilerplate.git
   cd nodejs-backend-boilerplate
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` file** (optional - Docker works with defaults)
   ```bash
   # Use any text editor
   nano .env
   # OR
   vim .env
   # OR
   code .env
   ```

4. **Start all services**
   ```bash
   npm run docker:up
   ```

   This command will:
   - Build the Docker image
   - Start MongoDB on port 27017
   - Start Redis on port 6379
   - Start the API on port 3000
   - Start Mongo Express (DB GUI) on port 8081

5. **Verify services are running**
   ```bash
   docker-compose ps
   ```

6. **Access the application**
   - API: http://localhost:3000
   - Swagger Docs: http://localhost:3000/api-docs
   - Health Check: http://localhost:3000/health
   - Mongo Express: http://localhost:8081 (username: `admin`, password: `admin123`)

7. **View logs**
   ```bash
   docker-compose logs -f app
   ```

8. **Stop services**
   ```bash
   npm run docker:down
   ```

### Option 2: Manual Installation

If you prefer to run services locally without Docker:

1. **Clone the repository**
   ```bash
   git clone https://github.com/devSahinur/nodejs-backend-boilerplate.git
   cd nodejs-backend-boilerplate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Ensure MongoDB is running**
   ```bash
   # macOS (if installed via Homebrew)
   brew services start mongodb-community

   # Linux
   sudo systemctl start mongod
   sudo systemctl status mongod

   # Windows - MongoDB should auto-start, or start manually from Services
   ```

4. **Ensure Redis is running** (optional but recommended)
   ```bash
   # macOS
   brew services start redis

   # Linux
   sudo systemctl start redis-server
   sudo systemctl status redis-server

   # Windows - Use Docker or WSL
   ```

5. **Create environment file**
   ```bash
   cp .env.example .env
   ```

6. **Configure environment variables** (see [Configuration](#configuration) section)

7. **Create logs directory**
   ```bash
   mkdir -p logs
   ```

8. **Seed the database** (optional - creates sample data)
   ```bash
   npm run seed
   ```

   This will create:
   - Admin user: `admin@example.com` / `Admin123!`
   - Regular user: `john@example.com` / `User123!`
   - Sample products

9. **Start the server**
   ```bash
   # Development mode (with hot reload)
   npm run dev

   # Production mode
   npm start
   ```

10. **Verify the server is running**
    ```bash
    curl http://localhost:3000/health
    ```

## Configuration

### Environment Variables

Create a `.env` file in the root directory. Here's a detailed explanation of all variables:

```bash
# ===========================================
# SERVER CONFIGURATION
# ===========================================
NODE_ENV=development                    # Options: development, production, test
PORT=3000                               # Port for the API server
BACKEND_IP=localhost                    # IP address to bind (use 0.0.0.0 for Docker)

# ===========================================
# DATABASE - MongoDB
# ===========================================
# Local MongoDB
MONGODB_URL=mongodb://localhost:27017/nodejs-backend

# Docker MongoDB (if using docker-compose)
# MONGODB_URL=mongodb://mongo:27017/nodejs-backend

# MongoDB Atlas (cloud)
# MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# ===========================================
# REDIS - For queues and caching
# ===========================================
REDIS_HOST=localhost                    # Use 'redis' if using Docker
REDIS_PORT=6379
REDIS_PASSWORD=                         # Leave empty if no password

# ===========================================
# JWT AUTHENTICATION
# ===========================================
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-123456789
JWT_ACCESS_EXPIRATION_MINUTES=30       # Access token expiry (30 minutes)
JWT_REFRESH_EXPIRATION_DAYS=30         # Refresh token expiry (30 days)
JWT_RESET_PASSWORD_EXPIRATION_MINUTES=10
JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=10

# ===========================================
# EMAIL - SMTP Configuration
# ===========================================
# Using Gmail (requires App Password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password        # Generate at: https://myaccount.google.com/apppasswords
EMAIL_FROM=noreply@yourapp.com

# Using SendGrid
# SMTP_HOST=smtp.sendgrid.net
# SMTP_PORT=587
# SMTP_USERNAME=apikey
# SMTP_PASSWORD=your-sendgrid-api-key

# Using Mailgun
# SMTP_HOST=smtp.mailgun.org
# SMTP_PORT=587
# SMTP_USERNAME=postmaster@yourdomain.mailgun.org
# SMTP_PASSWORD=your-mailgun-password

# ===========================================
# STRIPE PAYMENTS
# ===========================================
# Get from: https://dashboard.stripe.com/test/apikeys
STRIPE_SECRET_KEY=sk_test_51234567890abcdefghijklmnopqrstuvwxyz
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdefghijklmnopqrstuvwxyz

# ===========================================
# FIREBASE CLOUD MESSAGING (Push Notifications)
# ===========================================
# Get from Firebase Console > Project Settings > Service Accounts
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"

# ===========================================
# AWS - Optional (for S3 file uploads)
# ===========================================
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-s3-bucket-name

# ===========================================
# CLIENT - Frontend URL (for email links)
# ===========================================
CLIENT_URL=http://localhost:3000       # Change to production URL in production
```

### Setting up External Services

#### 1. **Stripe Setup** (for payments)

1. Create account at [stripe.com](https://stripe.com)
2. Get test keys from [Dashboard > API Keys](https://dashboard.stripe.com/test/apikeys)
3. For webhooks:
   ```bash
   # Install Stripe CLI
   brew install stripe/stripe-cli/stripe

   # Login
   stripe login

   # Forward webhooks to local server
   stripe listen --forward-to localhost:3000/api/v1/payments/webhook

   # Copy the webhook signing secret to .env as STRIPE_WEBHOOK_SECRET
   ```

#### 2. **Firebase Setup** (for push notifications)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Go to **Project Settings** > **Service Accounts**
4. Click **Generate New Private Key**
5. Copy the values to `.env`:
   ```bash
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

#### 3. **Email Setup** (Gmail example)

1. Enable 2-Factor Authentication on your Google Account
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Create app password for "Mail"
4. Use the generated password in `.env`:
   ```bash
   SMTP_USERNAME=your-email@gmail.com
   SMTP_PASSWORD=generated-app-password
   ```

## Running the Application

### Development Mode

```bash
# With hot reload (recommended for development)
npm run dev
```

The server will automatically restart when you make changes to the code.

### Production Mode

```bash
# Start the server
npm start
```

### Using PM2 (Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start src/index.js --name nodejs-backend

# View logs
pm2 logs nodejs-backend

# Restart
pm2 restart nodejs-backend

# Stop
pm2 stop nodejs-backend

# Monitor
pm2 monit
```

## API Documentation

Once the server is running, you can access:

### Swagger UI (Interactive API Docs)
- **URL**: http://localhost:3000/api-docs
- **Features**:
  - Try out API endpoints directly
  - View request/response schemas
  - See authentication requirements

### Other Endpoints
- **Health Check**: http://localhost:3000/health
  ```json
  {
    "status": "OK",
    "timestamp": "2025-01-02T10:30:00.000Z",
    "uptime": 123.456,
    "environment": "development"
  }
  ```

- **Prometheus Metrics**: http://localhost:3000/metrics
  - HTTP request metrics
  - Database query performance
  - Background job statistics

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/register` | Register new user | No |
| POST | `/api/v1/auth/login` | Login user | No |
| POST | `/api/v1/auth/logout` | Logout user | Yes |
| POST | `/api/v1/auth/refresh-tokens` | Refresh auth tokens | No |
| POST | `/api/v1/auth/forgot-password` | Send password reset email | No |
| POST | `/api/v1/auth/reset-password` | Reset password | No |
| POST | `/api/v1/auth/send-verification-email` | Send verification email | Yes |
| POST | `/api/v1/auth/verify-email` | Verify email | No |

### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/users` | Create user | Admin |
| GET | `/api/v1/users` | Get all users | Admin |
| GET | `/api/v1/users/:userId` | Get user | Yes |
| PATCH | `/api/v1/users/:userId` | Update user | Yes |
| DELETE | `/api/v1/users/:userId` | Delete user | Yes |

### Products

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/products` | Create product | Admin |
| GET | `/api/v1/products` | Get all products | No |
| GET | `/api/v1/products/:productId` | Get product | No |
| GET | `/api/v1/products/slug/:slug` | Get product by slug | No |
| GET | `/api/v1/products/search?q=query` | Search products | No |
| GET | `/api/v1/products/featured` | Get featured products | No |
| GET | `/api/v1/products/category/:category` | Get products by category | No |
| PATCH | `/api/v1/products/:productId` | Update product | Admin |
| DELETE | `/api/v1/products/:productId` | Delete product | Admin |

### Orders

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/orders` | Create order | Yes |
| GET | `/api/v1/orders` | Get all orders | Admin |
| GET | `/api/v1/orders/my-orders` | Get user's orders | Yes |
| GET | `/api/v1/orders/:orderId` | Get order | Yes |
| GET | `/api/v1/orders/status/:status` | Get orders by status | Admin |
| PATCH | `/api/v1/orders/:orderId/status` | Update order status | Admin |
| POST | `/api/v1/orders/:orderId/cancel` | Cancel order | Yes |

### Payments

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/payments/create-intent` | Create payment intent | Yes |
| GET | `/api/v1/payments/:paymentIntentId` | Get payment details | Yes |
| POST | `/api/v1/payments/:paymentIntentId/refund` | Create refund | Admin |
| POST | `/api/v1/payments/webhook` | Stripe webhook | No |

### Notifications

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/notifications/email` | Send email | Admin |
| POST | `/api/v1/notifications/push` | Send push notification | Admin |
| POST | `/api/v1/notifications/push/multicast` | Send to multiple devices | Admin |
| POST | `/api/v1/notifications/push/topic` | Send to topic | Admin |
| POST | `/api/v1/notifications/topic/subscribe` | Subscribe to topic | Yes |
| POST | `/api/v1/notifications/topic/unsubscribe` | Unsubscribe from topic | Yes |

### Static Pages

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/static/terms` | Get terms of service | No |
| GET | `/api/v1/static/privacy` | Get privacy policy | No |
| GET | `/api/v1/static/about` | Get about page | No |

## Testing

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with Coverage

```bash
npm test -- --coverage
```

### View Coverage Report

```bash
# After running tests with coverage
open coverage/lcov-report/index.html
```

### Writing Tests

Tests are located in the `tests/` directory:

```
tests/
├── integration/      # Integration tests
│   ├── auth.test.js
│   ├── user.test.js
│   └── product.test.js
└── unit/            # Unit tests
    ├── services/
    └── utils/
```

Example test:
```javascript
import request from 'supertest';
import app from '../src/app.js';

describe('Auth endpoints', () => {
  test('should register a new user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      })
      .expect(201);

    expect(res.body.user).toHaveProperty('id');
    expect(res.body.tokens).toHaveProperty('access');
  });
});
```

## Database

### Migrations

```bash
# Create a new migration
npm run migrate:create -- add-user-preferences

# Run pending migrations
npm run migrate:up

# Rollback last migration
npm run migrate:down
```

### Seeding

Populate the database with sample data:

```bash
npm run seed
```

This creates:
- **Admin User**:
  - Email: `admin@example.com`
  - Password: `Admin123!`

- **Regular Users**:
  - Email: `john@example.com`, Password: `User123!`
  - Email: `jane@example.com`, Password: `User123!`

- **Sample Products**: 5 electronics products

### Database GUI Tools

#### Using Mongo Express (with Docker)

```bash
# Start Docker services
npm run docker:up

# Access Mongo Express
open http://localhost:8081
```
- Username: `admin`
- Password: `admin123`

#### Using MongoDB Compass (Standalone)

1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect with: `mongodb://localhost:27017`

## Linting & Formatting

### ESLint

```bash
# Check for linting errors
npm run lint

# Fix linting errors automatically
npm run lint -- --fix
```

### Prettier

```bash
# Format all files
npm run format

# Check formatting without writing
npm run format -- --check
```

### Pre-commit Hooks

Husky runs linting and formatting automatically before commits:

```bash
git add .
git commit -m "feat: add new feature"
# Husky will run lint and format automatically
```

## Deployment

### Option 1: AWS ECS (Recommended for Production)

#### Prerequisites
- AWS Account
- AWS CLI installed
- Docker installed

#### Setup

1. **Configure AWS CLI**
   ```bash
   aws configure
   ```

2. **Create ECR Repository**
   ```bash
   aws ecr create-repository --repository-name nodejs-backend-boilerplate
   ```

3. **Configure GitHub Secrets**

   Go to your GitHub repository → Settings → Secrets and add:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`

4. **Push to main branch**
   ```bash
   git push origin main
   ```

The GitHub Actions workflow will:
- Run tests
- Build Docker image
- Push to Amazon ECR
- Deploy to AWS ECS

### Option 2: Heroku

```bash
# Install Heroku CLI
brew install heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Add MongoDB addon
heroku addons:create mongolab

# Add Redis addon
heroku addons:create heroku-redis

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret-key

# Deploy
git push heroku main
```

### Option 3: DigitalOcean App Platform

1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Click "Create App"
3. Connect your GitHub repository
4. Configure build settings:
   - Build Command: `npm install`
   - Run Command: `npm start`
5. Add MongoDB and Redis databases
6. Set environment variables
7. Deploy

### Option 4: VPS (Ubuntu)

```bash
# SSH into your server
ssh user@your-server-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
# (see Prerequisites section)

# Install PM2
npm install -g pm2

# Clone repository
git clone your-repo-url
cd your-repo

# Install dependencies
npm install

# Set up environment variables
nano .env

# Start with PM2
pm2 start src/index.js --name nodejs-backend

# Set up PM2 to start on boot
pm2 startup
pm2 save

# Set up Nginx as reverse proxy
sudo apt install nginx
sudo nano /etc/nginx/sites-available/default
```

Nginx config:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Restart Nginx
sudo systemctl restart nginx
```

## Project Structure

```
nodejs-backend-boilerplate/
├── .github/
│   └── workflows/
│       └── ci-cd.yml              # GitHub Actions CI/CD pipeline
├── .husky/
│   ├── commit-msg                 # Commitlint hook
│   └── pre-commit                 # Lint & format hook
├── docker/
│   ├── Dockerfile                 # Docker image definition
│   └── docker-compose.yml         # Multi-container setup
├── logs/                          # Application logs (gitignored)
├── migrations/                    # Database migrations
├── public/                        # Static files
├── scripts/
│   └── seed.js                    # Database seeding script
├── src/
│   ├── config/                    # Configuration files
│   │   ├── config.js             # Environment configuration
│   │   ├── database.js           # MongoDB connection
│   │   ├── logger.js             # Winston logger setup
│   │   ├── metrics.js            # Prometheus metrics
│   │   ├── morgan.js             # HTTP request logger
│   │   ├── passport.js           # Passport JWT strategy
│   │   ├── redis.js              # Redis client
│   │   ├── roles.js              # User roles definition
│   │   ├── swagger.js            # Swagger/OpenAPI setup
│   │   └── tokens.js             # Token types
│   ├── controllers/               # Request handlers
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── product.controller.js
│   │   ├── order.controller.js
│   │   ├── payment.controller.js
│   │   └── notification.controller.js
│   ├── middlewares/               # Custom middleware
│   │   ├── auth.js               # JWT authentication
│   │   ├── error.js              # Error handling
│   │   ├── validate.js           # Request validation
│   │   ├── rateLimiter.js        # Rate limiting
│   │   └── fileUpload.js         # File upload handling
│   ├── models/                    # Mongoose models
│   │   ├── user.model.js
│   │   ├── token.model.js
│   │   ├── product.model.js
│   │   ├── order.model.js
│   │   ├── terms.model.js
│   │   ├── privacy.model.js
│   │   ├── about.model.js
│   │   └── plugins/              # Mongoose plugins
│   │       ├── paginate.plugin.js
│   │       └── toJSON.plugin.js
│   ├── queues/                    # Background job queues
│   │   ├── index.js              # Queue definitions
│   │   └── processors/           # Job processors
│   │       ├── email.processor.js
│   │       ├── notification.processor.js
│   │       └── order.processor.js
│   ├── routes/                    # API routes
│   │   └── v1/
│   │       ├── index.js          # Route aggregator
│   │       ├── auth.routes.js
│   │       ├── user.routes.js
│   │       ├── product.routes.js
│   │       ├── order.routes.js
│   │       ├── payment.routes.js
│   │       ├── notification.routes.js
│   │       ├── terms.routes.js
│   │       ├── privacy.routes.js
│   │       └── about.routes.js
│   ├── services/                  # Business logic
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── token.service.js
│   │   ├── product.service.js
│   │   ├── order.service.js
│   │   ├── payments/
│   │   │   └── stripe.service.js
│   │   └── notifications/
│   │       ├── email.service.js
│   │       └── fcm.service.js
│   ├── utils/                     # Utility functions
│   │   ├── ApiError.js           # Custom error class
│   │   ├── catchAsync.js         # Async error wrapper
│   │   └── pick.js               # Object property picker
│   ├── validations/               # Joi validation schemas
│   │   ├── auth.validation.js
│   │   ├── user.validation.js
│   │   ├── product.validation.js
│   │   ├── order.validation.js
│   │   └── custom.validation.js
│   ├── app.js                     # Express app setup
│   └── index.js                   # Entry point
├── tests/                         # Test files
│   ├── integration/
│   │   └── auth.test.js
│   └── unit/
├── .dockerignore                  # Docker ignore file
├── .env.example                   # Environment variables template
├── .eslintrc.json                 # ESLint configuration
├── .gitignore                     # Git ignore file
├── .prettierrc.json               # Prettier configuration
├── commitlint.config.js           # Commitlint configuration
├── jest.config.js                 # Jest configuration
├── migrate-mongo-config.js        # Migration configuration
├── package.json                   # NPM dependencies
└── README.md                      # This file
```

## Available Scripts

This boilerplate includes a comprehensive set of npm scripts to streamline your development workflow. Below is a detailed explanation of each script:

### Development Scripts

#### `npm run dev`
**Description:** Starts the development server with automatic hot-reload using Nodemon.

**When to use:** During active development when you want the server to automatically restart on file changes.

**Example:**
```bash
npm run dev
```

**Output:** Server starts on `http://localhost:3000` with auto-reload enabled.

---

#### `npm start`
**Description:** Starts the production server without hot-reload.

**When to use:** In production environments or when you want to test the production build locally.

**Example:**
```bash
NODE_ENV=production npm start
```

**Note:** Ensure all environment variables are set before running in production.

---

### Testing Scripts

#### `npm test`
**Description:** Runs all test suites with coverage reporting using Jest.

**When to use:** Before committing code, in CI/CD pipelines, or when you want to verify all tests pass.

**Example:**
```bash
npm test
```

**What it does:**
- Runs all `*.test.js` and `*.spec.js` files
- Generates coverage reports in `coverage/` directory
- Requires 70% code coverage (configurable in `jest.config.js`)

**View coverage report:**
```bash
open coverage/lcov-report/index.html  # macOS
xdg-open coverage/lcov-report/index.html  # Linux
```

---

#### `npm run test:watch`
**Description:** Runs tests in watch mode, re-running tests when files change.

**When to use:** During test-driven development (TDD) or when actively writing tests.

**Example:**
```bash
npm run test:watch
```

**Features:**
- Automatically re-runs tests on file changes
- Interactive mode with options to filter tests
- Press `p` to filter by filename pattern
- Press `t` to filter by test name pattern

---

### Code Quality Scripts

#### `npm run lint`
**Description:** Checks and automatically fixes code style issues using ESLint.

**When to use:** Before committing code or when you want to enforce coding standards.

**Example:**
```bash
npm run lint
```

**What it checks:**
- Airbnb JavaScript style guide compliance
- Import/export statement correctness
- Potential bugs and code smells
- Best practices for Node.js and Express

**Configuration:** See `.eslintrc.json` for rules.

---

#### `npm run format`
**Description:** Formats all code files according to Prettier configuration.

**When to use:** Before committing code to ensure consistent formatting across the codebase.

**Example:**
```bash
npm run format
```

**What it formats:**
- JavaScript/JSON files
- Markdown documentation
- YAML configuration files

**Check without formatting:**
```bash
npm run format -- --check
```

**Configuration:** See `.prettierrc` for formatting rules.

---

### Docker Scripts

#### `npm run docker:up`
**Description:** Starts all Docker containers in detached mode (app, MongoDB, Redis).

**When to use:** When you want to run the entire stack using Docker without installing MongoDB and Redis locally.

**Example:**
```bash
npm run docker:up
```

**What it starts:**
- Application container on port 3000
- MongoDB container on port 27017
- Redis container on port 6379
- Mongo Express (DB admin UI) on port 8081

**Access services:**
- API: http://localhost:3000
- Mongo Express: http://localhost:8081 (admin/pass)

---

#### `npm run docker:down`
**Description:** Stops and removes all Docker containers.

**When to use:** When you're done with Docker development and want to free up resources.

**Example:**
```bash
npm run docker:down
```

**Remove volumes too:**
```bash
npm run docker:down -- -v
```

---

#### `npm run docker:build`
**Description:** Rebuilds Docker images from scratch.

**When to use:** After changing Dockerfile, package.json dependencies, or when images are corrupted.

**Example:**
```bash
npm run docker:build
```

**Force rebuild without cache:**
```bash
npm run docker:build -- --no-cache
```

---

### Database Scripts

#### `npm run seed`
**Description:** Populates the database with sample data for development.

**When to use:** After initial setup or when you need fresh test data.

**Example:**
```bash
npm run seed
```

**What it creates:**
- Admin user (admin@example.com / Admin123!)
- Sample products with categories
- Sample orders

**Note:** Clears existing data before seeding. Use with caution in production.

---

#### `npm run migrate:up`
**Description:** Runs pending database migrations.

**When to use:** After pulling new code with database schema changes or when deploying to production.

**Example:**
```bash
npm run migrate:up
```

**Configuration:** See `migrate-mongo-config.js` and `migrations/` directory.

---

#### `npm run migrate:down`
**Description:** Rolls back the last applied migration.

**When to use:** When you need to undo the most recent database migration.

**Example:**
```bash
npm run migrate:down
```

**Warning:** This may result in data loss. Always backup your database first.

---

#### `npm run migrate:create <name>`
**Description:** Creates a new migration file.

**When to use:** When you need to make database schema changes.

**Example:**
```bash
npm run migrate:create add_user_roles
```

**Output:** Creates a new file in `migrations/` directory with timestamp.

---

### Git Hooks Script

#### `npm run prepare`
**Description:** Installs Husky git hooks for pre-commit validation.

**When to use:** Automatically runs after `npm install`. Manually run if hooks aren't working.

**Example:**
```bash
npm run prepare
```

**What it sets up:**
- Pre-commit hook: Runs linting and formatting on staged files
- Commit-msg hook: Validates commit message format (Conventional Commits)

**Bypass hooks (not recommended):**
```bash
git commit --no-verify -m "message"
```

---

### Quick Reference Table

| Script | Use Case | Required Services |
|--------|----------|-------------------|
| `npm run dev` | Local development | MongoDB, Redis |
| `npm start` | Production run | MongoDB, Redis |
| `npm test` | Testing & CI/CD | MongoDB, Redis |
| `npm run test:watch` | TDD workflow | MongoDB, Redis |
| `npm run lint` | Code quality check | None |
| `npm run format` | Code formatting | None |
| `npm run docker:up` | Docker development | Docker |
| `npm run docker:down` | Stop Docker | Docker |
| `npm run docker:build` | Rebuild images | Docker |
| `npm run seed` | Generate test data | MongoDB |
| `npm run migrate:up` | Apply migrations | MongoDB |
| `npm run migrate:down` | Revert migration | MongoDB |
| `npm run migrate:create` | Create migration | None |
| `npm run prepare` | Setup git hooks | None |

---

### Common Workflows

**Starting development for the first time:**
```bash
npm install
cp .env.example .env  # Configure your environment
npm run migrate:up    # Apply database migrations
npm run seed          # Add sample data
npm run dev           # Start developing
```

**Before committing code:**
```bash
npm run lint          # Fix code style issues
npm run format        # Format all files
npm test              # Ensure tests pass
git add .
git commit -m "feat: your feature"  # Husky hooks run automatically
```

**Using Docker:**
```bash
npm run docker:build  # First time only
npm run docker:up     # Start all services
# Develop...
npm run docker:down   # When finished
```

**Deploying to production:**
```bash
npm run lint
npm test
npm run migrate:up    # On production server
NODE_ENV=production npm start
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or change port in .env
PORT=3001
```

### MongoDB Connection Error

```bash
# Check if MongoDB is running
# macOS
brew services list | grep mongodb

# Linux
sudo systemctl status mongod

# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

### Redis Connection Error

```bash
# Check if Redis is running
redis-cli ping  # Should return "PONG"

# Start Redis
brew services start redis              # macOS
sudo systemctl start redis-server      # Linux
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Permission Errors

```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config
```

### Docker Issues

```bash
# Remove all containers and volumes
docker-compose down -v

# Rebuild from scratch
docker-compose build --no-cache
docker-compose up -d
```

### Husky Hooks Not Working

```bash
# Reinstall Husky
npm uninstall husky
npm install husky --save-dev
npm run prepare
```

### Email Not Sending

1. Check SMTP credentials in `.env`
2. For Gmail, ensure you're using an App Password (not your account password)
3. Check firewall/antivirus settings
4. Test SMTP connection:
   ```bash
   telnet smtp.gmail.com 587
   ```

### Stripe Webhook Issues

```bash
# Ensure Stripe CLI is running
stripe listen --forward-to localhost:3000/api/v1/payments/webhook

# Check webhook secret matches .env
stripe listen
```

### ES Module Errors

Ensure all import statements include `.js` extension:
```javascript
// ✅ Correct
import User from './models/user.model.js';

// ❌ Wrong
import User from './models/user.model';
```

## Security

- ✅ Passwords hashed with bcrypt (8 rounds)
- ✅ JWT tokens for stateless authentication
- ✅ Rate limiting on auth endpoints (5 requests per minute)
- ✅ Input validation with Joi
- ✅ XSS protection with xss-clean
- ✅ NoSQL injection prevention with express-mongo-sanitize
- ✅ Security headers with Helmet
- ✅ CORS enabled with configurable origins
- ✅ Environment variables for sensitive data
- ✅ HTTPS recommended for production

## Performance

- ⚡ Redis caching for frequently accessed data
- ⚡ Bull queues for background job processing
- ⚡ Database indexing on frequently queried fields
- ⚡ Gzip compression for API responses
- ⚡ Prometheus metrics for monitoring
- ⚡ Connection pooling for MongoDB
- ⚡ Optimized Docker multi-stage builds

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Make your changes
4. Run tests and linting
   ```bash
   npm test
   npm run lint
   ```
5. Commit your changes (follows conventional commits)
   ```bash
   git commit -m "feat: add amazing feature"
   ```
6. Push to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
7. Open a Pull Request

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation only
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Adding tests
- `chore:` Maintenance tasks

## License

This project is licensed under the MIT License.

## Support

- 📧 **Email**: support@yourapp.com
- 💬 **Discord**: [Join our server](https://discord.gg/yourserver)
- 🐛 **Issues**: [GitHub Issues](https://github.com/devSahinur/nodejs-backend-boilerplate/issues)
- 📚 **Docs**: [Full Documentation](https://docs.yourapp.com)

## Acknowledgments

- [Express.js](https://expressjs.com/) - Web framework
- [Mongoose](https://mongoosejs.com/) - MongoDB ODM
- [Passport.js](http://www.passportjs.org/) - Authentication
- [Stripe](https://stripe.com/) - Payment processing
- [Firebase](https://firebase.google.com/) - Push notifications
- [Bull](https://github.com/OptimalBits/bull) - Queue processing
- [Jest](https://jestjs.io/) - Testing framework

---

**Built with ❤️ for developers by developers**

Need help? [Open an issue](https://github.com/devSahinur/nodejs-backend-boilerplate/issues) or check our [FAQ](https://docs.yourapp.com/faq)
