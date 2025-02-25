// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const authController = require('../controllers/authController');
const tokenController = require('../controllers/tokenController');

// Registration Route with validation middleware
router.post(
  '/register',
  [
    body('username')
      .notEmpty()
      .withMessage('Username is required'),
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ],
  authController.register
);

router.post(
  '/login',
  [
    body('identifier')
      .notEmpty()
      .withMessage('Email or username is required'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  authController.login
);


router.post(
  '/forgot-password',
  [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email')
  ],
  authController.forgotPassword
);

// New endpoint for token refresh
router.post('/token', tokenController.refreshToken);

module.exports = router;
