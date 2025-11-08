import express from 'express';
import validate from '../../middlewares/validate.js';
import { authValidation } from '../../validations/index.js';
import { authController } from '../../controllers/index.js';
import auth from '../../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and authorization endpoints
 */

/**
 * @swagger
 * /v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account with email and password.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: User's password (minimum 8 characters)
 *               name:
 *                 type: string
 *                 description: User's full name
 *     responses:
 *       "201":
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                 tokens:
 *                   type: object
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 */
router.post('/register', validate(authValidation.register), authController.register);

/**
 * @swagger
 * /v1/auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticate user with email and password.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *     responses:
 *       "200":
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                 tokens:
 *                   type: object
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/login', validate(authValidation.login), authController.login);

/**
 * @swagger
 * /v1/auth/verify-email:
 *   post:
 *     summary: Verify email address
 *     description: Verify user's email address with verification token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: Email verification token
 *     responses:
 *       "200":
 *         description: Email verified successfully
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/verify-email', validate(authValidation.verifyEmail), authController.verifyEmail);

/**
 * @swagger
 * /v1/auth/reset-password:
 *   post:
 *     summary: Reset password
 *     description: Reset user password using reset token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *                 description: Password reset token
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: New password
 *     responses:
 *       "200":
 *         description: Password reset successful
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);

/**
 * @swagger
 * /v1/auth/change-password:
 *   post:
 *     summary: Change password
 *     description: Logged in users can change their password.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 description: Current password
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: New password
 *     responses:
 *       "200":
 *         description: Password changed successfully
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/change-password', auth('common'), validate(authValidation.changePassword), authController.changePassword);

/**
 * @swagger
 * /v1/auth/forgot-password:
 *   post:
 *     summary: Forgot password
 *     description: Send password reset email to user.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *     responses:
 *       "200":
 *         description: Password reset email sent
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);

/**
 * @swagger
 * /v1/auth/logout:
 *   post:
 *     summary: Logout
 *     description: Logout user and invalidate refresh token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh token to invalidate
 *     responses:
 *       "204":
 *         description: Logout successful
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router.post('/logout', validate(authValidation.logout), authController.logout);

/**
 * @swagger
 * /v1/auth/refresh-tokens:
 *   post:
 *     summary: Refresh auth tokens
 *     description: Refresh access and refresh tokens using valid refresh token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Valid refresh token
 *     responses:
 *       "200":
 *         description: Tokens refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access:
 *                   type: object
 *                 refresh:
 *                   type: object
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);

/**
 * @swagger
 * /v1/auth/send-verification-email:
 *   post:
 *     summary: Send verification email
 *     description: Logged in users can request a new verification email.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Verification email sent
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/send-verification-email', auth(), authController.sendVerificationEmail);

/**
 * @swagger
 * /v1/auth/delete-me:
 *   post:
 *     summary: Delete own account
 *     description: Users can delete their own account.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password for confirmation
 *     responses:
 *       "200":
 *         description: Account deleted successfully
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/delete-me', auth('user'), validate(authValidation.deleteMe), authController.deleteMe);

export default router;
