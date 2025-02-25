// src/middlewares/errorHandler.js
module.exports = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error, please try again later.' });
  };
  