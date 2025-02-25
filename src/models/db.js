// src/models/db.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // This allows a self-signed certificate; adjust as needed
  },
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
