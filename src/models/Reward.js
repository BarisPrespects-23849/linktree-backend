// src/models/Reward.js
const db = require('./db');

const createReward = async ({ userId, rewardPoints, description }) => {
  const result = await db.query(
    `INSERT INTO rewards (user_id, reward_points, description, created_at) 
     VALUES ($1, $2, $3, NOW()) RETURNING *`,
    [userId, rewardPoints, description]
  );
  return result.rows[0];
};

const addRewardPoints = async (userId, points) => {

  return createReward({
    userId,
    rewardPoints: points,
    description: 'Reward for successful referral'
  });
};

module.exports = {
  createReward,
  addRewardPoints,
};
