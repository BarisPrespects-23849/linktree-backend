// src/routes/referralRoutes.js
const express = require('express');
const referralController = require('../controllers/referralController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();


router.use(authMiddleware);


router.get('/referrals', referralController.getReferrals);


router.get('/referral-stats', referralController.getReferralStats);

module.exports = router;
