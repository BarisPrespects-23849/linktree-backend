// src/models/User.js
const db = require('./db');

const createUser = async ({ username, email, passwordHash, referralCode, referredBy }) => {
  const result = await db.query(
    `INSERT INTO users (username, email, password_hash, referral_code, referred_by, created_at)
     VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
    [username, email, passwordHash, referralCode, referredBy]
  );
  return result.rows[0];
};

const findUserByEmailOrUsername = async (identifier) => {
  const result = await db.query(
    `SELECT * FROM users WHERE email = $1 OR username = $1`,
    [identifier]
  );
  return result.rows[0];
};

const findUserById = async (id) => {
  const result = await db.query(
    `SELECT * FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

const findUserByReferralCode = async (code) => {
  const result = await db.query(
    `SELECT * FROM users WHERE referral_code = $1`,
    [code]
  );
  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmailOrUsername,
  findUserById,
  findUserByReferralCode,
};
