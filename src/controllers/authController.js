// src/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Referral = require('../models/Referral');

const { addRewardPoints } = require('../models/Reward');


const generateReferralCode = (username) => {
  return `${username}-${Math.random().toString(36).substring(2, 8)}`;
};

exports.register = async (req, res, next) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, referralCode } = req.body;

    // Check duplicacy
    const existingUser = await User.findUserByEmailOrUsername(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email or username already in use' });
    }


    const passwordHash = await bcrypt.hash(password, 10);

    // Referral Generator
    const userReferralCode = generateReferralCode(username);


    let referredBy = null;
    if (referralCode) {
      const referrer = await User.findUserByReferralCode(referralCode);
      if (!referrer) {
        return res.status(400).json({ error: 'Invalid referral code' });
      }
      // self-referral prevention
      if (referrer.email === email) {
        return res.status(400).json({ error: 'You cannot refer yourself' });
      }
      referredBy = referrer.id;
    }

    // Create the user
    const newUser = await User.createUser({
      username,
      email,
      passwordHash,
      referralCode: userReferralCode,
      referredBy,
    });


    if (referredBy) {
      await Referral.createReferral({
        referrerId: referredBy,
        referredUserId: newUser.id,
        status: 'successful',
      });

     //Points award
      await addRewardPoints(referredBy, 10);
    }

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
    try {
      const { identifier, password } = req.body; // identifier can be email or username
  
      const user = await User.findUserByEmailOrUsername(identifier);
      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
  
      // Generate an access token (expires in 1h) and a refresh token (expires in 7d)
      const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d',
      });
  
      // Set tokens in HttpOnly cookies
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // true in production
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000 // 1 hour
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
  
      // You can still send tokens in the response body if needed:
      res.json({ accessToken, refreshToken });
    } catch (err) {
      next(err);
    }
  };
  
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findUserByEmailOrUsername(email);
    if (!user) {
      return res.status(400).json({ error: 'Email not found' });
    }
        res.json({ message: 'Password reset instructions sent to your email' });
  } catch (err) {
    next(err);
  }
};

