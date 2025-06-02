# Linktree-Style Backend with Referral & Reward System

A secure, scalable Node.js backend for a Linktree/Bento.me–style application. This project supports user registration, JWT-based authentication (with access and refresh tokens stored in HttpOnly cookies), a referral system with reward tracking, password reset functionality, and several security and performance enhancements. Comprehensive tests ensure that all features work as expected.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Challenges and Solutions](#challenges-and-solutions)
- [Security & Performance Enhancements](#security--performance-enhancements)
- [Future Enhancements](#future-enhancements)
- [Video Explation of the Project]

## Overview

This project is a backend service designed to support a Linktree/Bento.me–style application. It allows users to register, log in, and reset their passwords securely. Additionally, it features a referral system where users earn reward points for successful referrals. To ensure performance and scalability, Redis caching is integrated, and various security enhancements (such as Helmet and rate limiting) are in place.

## Features

- **User Registration & Authentication**
  - Register with email, username, and password.
  - Validate email format, password strength, and prevent duplicate registrations.
  - Automatically generate a unique referral code for each user.
  - Prevent self-referral by checking that a user does not use their own referral code.

- **Login & Token Management**
  - Log in using email or username.
  - JWT-based authentication with an access token (expires in 1 hour) and a refresh token (expires in 7 days).
  - Tokens are stored in HttpOnly cookies to mitigate XSS risks.

- **Password Reset**
  - A "forgot password" endpoint allows users to request a password reset.
  - (In production, this would trigger sending a secure, expiring token via email.)

- **Referral System & Reward Logic**
  - Track successful referrals using unique referral codes.
  - Award reward points to referrers upon successful sign-ups.
  - Accurately track referral counts.

- **Caching**
  - Implement Redis caching (for referral data, etc.) to reduce database load and improve performance.

## Technologies Used

- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Caching:** Redis
- **Authentication:** JSON Web Tokens (JWT)
- **Security:** Helmet, express-rate-limit, cookie-parser, (optional: csurf)
- **Testing:** Jest, Supertest
- **Environment Management:** dotenv

## Installation

1. **Clone the Repository**

   Open your terminal and run:
   ```bash
   git clone https://github.com/yourusername/linktree-backend.git
   cd linktree-backend
   ```

2. **Install Dependencies**

   Run the following command in the project directory:
   ```bash
   npm install
   ```

3. **Install and Run Redis (for Local Development)**
   - **macOS (using Homebrew):**
     ```bash
     brew install redis
     redis-server
     ```
   - **Linux:**
     ```bash
     sudo apt-get update
     sudo apt-get install redis-server
     sudo systemctl start redis
     ```
   - **Windows:**
     Use Docker:
     ```bash
     docker run --name redis -p 6379:6379 -d redis
     ```

## Configuration

Create a `.env` file in the root directory and add the following:

```env
PORT=5001
NODE_ENV=development
DATABASE_URL=postgres://username:password@localhost:5432/yourdbname
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
REDIS_URL=redis://localhost:6379
```

- Replace `username`, `password`, and `yourdbname` with your PostgreSQL credentials.
- Generate secure values for `JWT_SECRET` and `JWT_REFRESH_SECRET` (e.g., using `openssl rand -base64 32`).

## Running the Application

To start the server, run:
```bash
npm start
```
The server will run on the port specified in your `.env` file (default is 5001).

## Testing

This project includes comprehensive integration and unit tests using Jest and Supertest. The tests cover:

- User registration (including duplicate and referral logic)
- Login (including token issuance and failure cases)
- Password reset request
- Token refresh
- Protected endpoints (fetching referrals)
- Referral system logic (invalid referral codes, self-referral prevention, and accurate referral count tracking)
- Custom validators for email, password, username, and referral code

To run the tests, execute:
```bash
npm test
```

### Redis Connection Note

During testing, if the Redis connection remains open, Jest may not exit automatically. To resolve this, ensure your tests close the Redis connection by calling `redisClient.quit()` in your `afterAll` hook or manually stop Redis after tests. In our setup, stopping Redis allowed Jest to exit properly.

## Project Structure

```
linktree-backend/
├── src/
│   ├── controllers/
│   │   ├── authController.js       # Registration, login, and password reset logic
│   │   └── referralController.js   # Referral system and reward logic with caching
│   ├── middlewares/
│   │   ├── errorHandler.js         # Global error handling middleware
│   │   └── rateLimiter.js          # Rate limiting middleware using express-rate-limit
│   ├── models/
│   │   ├── User.js                 # User model and database queries
│   │   ├── Referral.js             # Referral model and tracking logic
│   │   └── Reward.js               # Reward system model
│   ├── utils/
│   │   ├── validator.js            # Custom validation functions (email, password, username, referral code)
│   │   └── cache.js                # Redis caching utility
│   └── ...                         # Other supporting files
├── tests/
│   ├── test.js                     # Integration tests for API endpoints
│   └── validator.test.js           # Unit tests for custom validators
├── .env                            # Environment variables (not committed to Git)
├── .gitignore                      # Contains .env to prevent sensitive data from being committed
├── package.json
└── README.md
```

## Challenges and Solutions

1. **Foreign Key Constraint Errors during Test Cleanup:**
   - **Problem:** Rows in the `referrals` and `rewards` tables referenced test users, causing deletion failures.
   - **Solution:** We updated the `referred_by` field to `NULL` for test users before deletion and ensured that we deleted from child tables (referrals and rewards) before deleting from the users table.

2. **Redis Connection Hanging Jest:**
   - **Problem:** An open Redis connection prevented Jest from exiting.
   - **Solution:** We ensured that the Redis connection is properly closed by calling `redisClient.quit()` (or by manually stopping Redis) in our cleanup routines, allowing Jest to exit cleanly.

3. **Self-Referral Prevention:**
   - **Problem:** Users might try to refer themselves.
   - **Solution:** Our registration logic checks that the referral code owner's email does not match the registering user's email and returns an error if they match.

## Security & Performance Enhancements

- **Security:**
  - **SQL Injection Protection:** Uses parameterized queries.
  - **XSS Protection:** Helmet sets secure HTTP headers.
  - **Rate Limiting:** express-rate-limit is applied to sensitive endpoints to prevent brute-force attacks.
  - **Secure JWT Storage:** JWT tokens are stored in HttpOnly cookies to protect against XSS.
  - **Input Validation:** Custom validators ensure that user inputs are sanitized.
  - **CSRF Protection:** (Optional) csurf middleware can be integrated for additional protection if using cookie-based sessions.

- **Performance:**
  - **Redis Caching:** Frequently accessed data (e.g., referral information) is cached to reduce database load.
  - **Scalability:** Stateless JWT authentication supports horizontal scaling and load balancing in production environments.

## Future Enhancements

- **Enable CSRF Protection:** Integrate csurf middleware if using cookie-based sessions.
- **Improve Logging and Monitoring:** Consider using Winston or Morgan along with external monitoring tools.
- **Expand Caching Strategies:** Implement caching for additional endpoints as needed.
- **Deployment Enhancements:** Containerize the application with Docker and use load balancers for production deployment.

## Video Explanation
- ** https://drive.google.com/file/d/1EJClKUE7dQkiwOxaDA6s8930CRrdXvm-/view?usp=sharing **
