require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');

// Your route imports
const authRoutes = require('./src/routes/authRoutes');
const referralRoutes = require('./src/routes/referralRoutes');
const errorHandler = require('./src/middlewares/errorHandler');

// Rate limiting middleware (we'll create this in Step 3)
const rateLimiter = require('./src/middlewares/rateLimiter');

const app = express();

// Middleware setup
app.use(helmet()); // Set security-related HTTP headers
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// If using CSRF protection (uncomment if you want to enforce CSRF)
// Note: csurf requires sessions or cookie-based tokens. Here we use cookies.
// const csrfProtection = csurf({ cookie: true });
// app.use(csrfProtection);

// Apply rate limiting to API endpoints (e.g., all routes starting with /api)
app.use('/api', rateLimiter);

// API Routes
app.use('/api', authRoutes);
app.use('/api', referralRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start the server only if this file is run directly
if (require.main === module) {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
