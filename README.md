```markdown
# Linktree-Style Backend with Referral & Reward System

This project is a secure, efficient, and scalable backend for a service similar to [Linktree](https://linktr.ee/) or [Bento.me](https://bento.me/). It supports user registration, authentication, a referral system with reward points, password reset, and various security and performance enhancements.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Challenges and Solutions](#challenges-and-solutions)
- [Security & Performance Enhancements](#security--performance-enhancements)
- [Future Enhancements](#future-enhancements)

## Features

- **User Registration & Authentication**
  - Register with email, username, and password.
  - Input validation (email format, password strength, non-empty username, and duplicate checks).
  - Unique referral code generation on registration.
  - Self-referral prevention to ensure users cannot refer themselves.
  
- **Login & Token Management**
  - Login using email or username.
  - JWT-based authentication with both access tokens (1 hour expiry) and refresh tokens (7 days expiry).
  - Tokens are stored in HttpOnly cookies for improved security.

- **Password Reset**
  - Password reset endpoint to request a reset. (In production, this would send a secure, expiring token via email.)

- **Referral System & Reward Logic**
  - Track referrals using unique referral codes.
  - Award reward points to referrers upon successful referrals.
  - Accurately track referral counts.

## Technologies

- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Caching:** Redis
- **Authentication:** JWT (Access & Refresh Tokens)
- **Security:** Helmet, express-rate-limit, cookie-parser, csurf (optional)
- **Testing:** Jest, Supertest
- **Others:** dotenv for environment variables

## Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/linktree-backend.git
   cd linktree-backend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Install and Run Redis (for local development):**
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

Create a `.env` file in the root directory with the following variables:

```env
PORT=5001
NODE_ENV=development
DATABASE_URL=postgres://username:password@localhost:5432/yourdbname
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
REDIS_URL=redis://localhost:6379
```

- Replace `username`, `password`, and `yourdbname` with your PostgreSQL credentials.
- Generate secure strings for `JWT_SECRET` and `JWT_REFRESH_SECRET` (e.g., using `openssl rand -base64 32`).

## Running the Application

Start the server with:

```bash
npm start
```

Your server will run on the port specified in the `.env` file (default is 5001).

## Testing

The project includes comprehensive integration and unit tests using Jest and Supertest. There is a complete test file that covers registration, login, password reset, token refresh, referral system logic (including edge cases such as invalid referral codes, self-referral prevention, and referral count tracking), as well as unit tests for our custom validators.

1. **Run Tests:**
   ```bash
   npm test
   ```
2. **Redis Connection Note:**
   - If the Redis connection remains open, Jest may not exit automatically.
   - Ensure that your test cleanup properly calls `redisClient.quit()` or manually stop Redis after tests.
   - In our setup, stopping Redis allows the tests to exit, confirming that the open connection was the issue.

## Challenges and Solutions

1. **Foreign Key Constraint Errors during Test Cleanup:**
   - **Problem:** Rows in the `referrals` and `rewards` tables referenced test users.
   - **Solution:** We updated the `referred_by` field to `NULL` before deletion and ensured the deletion order was:
     1. Delete from **referrals** (where either `referred_user_id` or `referrer_id` is in our test set).
     2. Delete from **rewards**.
     3. Delete from **users**.

2. **Redis Connection Hanging Jest:**
   - **Problem:** An open Redis connection prevented Jest from exiting.
   - **Solution:** We ensured the tests either call `redisClient.quit()` in cleanup or, if Redis is stopped manually, Jest exits properly.

3. **Self-Referral Prevention:**
   - **Problem:** Users could try to refer themselves.
   - **Solution:** Our registration logic checks that the referral code owner's email does not match the registering user's email, preventing self-referral.

## Security & Performance Enhancements

- **Security:**
  - **SQL Injection Protection:** Parameterized queries are used.
  - **XSS Protection:** Helmet sets secure HTTP headers.
  - **Rate Limiting:** Express-rate-limit is applied to critical endpoints.
  - **Secure JWT Storage:** JWT tokens are stored in HttpOnly cookies.
  - **CSRF Protection:** csurf can be enabled for cookie-based sessions (optional).

- **Performance:**
  - **Redis Caching:** Used to cache frequently accessed data, such as referral data.
  - **Scalability:** Stateless JWT authentication supports horizontal scaling and load balancing.

## Future Enhancements

- **Enable CSRF Protection:**  
  Use csurf middleware if using cookie-based sessions.
- **Improve Logging and Monitoring:**  
  Consider using Winston or Morgan along with external monitoring tools.
- **Expand Caching Strategies:**  
  Implement caching on additional endpoints as needed.
- **Deployment Enhancements:**  
  Containerize with Docker and use load balancers for production deployment.

---
