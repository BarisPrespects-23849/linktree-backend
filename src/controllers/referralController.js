// src/controllers/referralController.js
const Referral = require('../models/Referral');
const redisClient = require('../utils/cache'); // Ensure you have this set up as per our caching guide

exports.getReferrals = async (req, res, next) => {
  try {
    const userId = req.user.id; // req.user is set by your auth middleware
    const cacheKey = `referrals:${userId}`;
    
    // Check if the referrals data is cached
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.json({ referrals: JSON.parse(cachedData), cached: true });
    }
    
    // If not cached, fetch from the database
    const referrals = await Referral.getReferralsByUser(userId);
    
    // Cache the result for 1 hour (3600 seconds)
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(referrals));
    
    res.json({ referrals, cached: false });
  } catch (err) {
    next(err);
  }
};

exports.getReferralStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    // For stats, you can optionally use caching as well,
    // but here we simply fetch and calculate the stats.
    const referrals = await Referral.getReferralsByUser(userId);
    const successfulCount = referrals.filter(r => r.status === 'successful').length;
    res.json({ total: referrals.length, successful: successfulCount });
  } catch (err) {
    next(err);
  }
};
