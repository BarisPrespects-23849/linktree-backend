// src/controllers/tokenController.js
const jwt = require('jsonwebtoken');

exports.refreshToken = (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ error: 'Refresh token required' });
  
  jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ error: 'Invalid refresh token' });

    const accessToken = jwt.sign({ id: payload.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ accessToken });
  });
};
