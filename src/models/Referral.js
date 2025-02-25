// src/models/Referral.js
const db = require('./db');

const createReferral = async ({ referrerId, referredUserId, status = 'pending' }) => {
  const result = await db.query(
    `INSERT INTO referrals (referrer_id, referred_user_id, status, date_referred)
     VALUES ($1, $2, $3, NOW()) RETURNING *`,
    [referrerId, referredUserId, status]
  );
  return result.rows[0];
};

const getReferralsByUser = async (userId) => {
  const result = await db.query(
    `SELECT * FROM referrals WHERE referrer_id = $1`,
    [userId]
  );
  return result.rows;
};

module.exports = {
  createReferral,
  getReferralsByUser,
};
