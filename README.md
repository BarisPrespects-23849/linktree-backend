```markdown
# Linktree-Style Backend with Referral & Reward System

A secure, scalable Node.js backend for a Linktree/Bento.me–style application. This project provides user registration, JWT-based authentication (with access and refresh tokens stored in HttpOnly cookies), a referral system with reward tracking, password reset functionality, and various security and performance enhancements. Comprehensive tests ensure that all features work as expected.

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
- [License](#license)

## Features

- **User Registration & Authentication**
  - Register with email, username, and password.
  - Input validation for email format, password strength, and duplicate checks.
  - Unique referral code generation on registration.
  - Self-referral prevention: Users cannot refer themselves.
  
- **Login & Token Management**
  - Login using email or username.
  - JWT-based authentication issuing an **access token** (expires in 1 hour) and a **refresh token** (expires in 7 days).
  - Tokens are stored in HttpOnly cookies to protect against XSS.
  
- **Password Reset**
  - Forgot password endpoint to request a reset (in production, this would send a secure, expiring token via email).
  
- **Referral System & Reward Logic**
  - Track successful referrals using unique referral codes.
  - Award reward points to referrers upon successful referrals.
  - Accurately track referral counts.
  
- **Caching**
  - Redis caching is implemented (e.g., for referral data) to improve performance and reduce database load.

## Technologies

- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Caching:** Redis
- **Authentication:** JSON Web Tokens (JWT)
- **Security:** Helmet, express-rate-limit, cookie-parser, (optional: csurf)
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
- Generate secure values for `JWT_SECRET` and `JWT_REFRESH_SECRET` (e.g., using `openssl rand -base64 32`).

## Running the Application

Start the server with:

```bash
npm start
```

The server will run on the port specified in your `.env` file (default is 5001).

## Testing

The project includes comprehensive integration and unit tests using Jest and Supertest.

1. **Run Tests:**

   ```bash
   npm test
   ```

2. **Redis Connection Note:**
   - During testing, if the Redis connection remains open, Jest may not exit automatically.
   - Ensure that your tests properly close the Redis connection (by calling `redisClient.quit()` in your `afterAll` hook) or manually stop Redis after tests.
   - In our setup, stopping Redis allowed Jest to exit properly.

## Challenges and Solutions

1. **Foreign Key Constraint Errors during Test Cleanup:**
   - **Problem:** Rows in the `referrals` and `rewards` tables referenced test users, causing cleanup failures.
   - **Solution:** We updated the `referred_by` field to `NULL` before deletion and ensured that we deleted from child tables (referrals and rewards) before deleting from the users table.

2. **Redis Connection Hanging Jest:**
   - **Problem:** An open Redis connection was preventing Jest from exiting.
   - **Solution:** We ensured the Redis connection is properly closed (using `redisClient.quit()` in our cleanup or stopping Redis manually) so that Jest exits automatically.

3. **Self-Referral Prevention:**
   - **Problem:** Users might try to refer themselves.
   - **Solution:** Our registration logic checks that the referral code owner's email does not match the registering user's email and returns an error if they match.

## Security & Performance Enhancements

- **Security:**
  - **SQL Injection Protection:** Uses parameterized queries.
  - **XSS Protection:** Helmet sets secure HTTP headers.
  - **Rate Limiting:** express-rate-limit is applied to sensitive endpoints to prevent brute-force attacks.
  - **Secure JWT Storage:** Tokens are stored in HttpOnly cookies to protect against XSS.
  - **Input Validation:** Custom validators prevent malicious inputs.
  - **CSRF Protection:** (Optional) Use csurf if using cookie-based sessions.

- **Performance:**
  - **Redis Caching:** Caches frequently accessed data (e.g., referral data) to reduce database load.
  - **Scalability:** Stateless JWT authentication supports horizontal scaling and load balancing.

## Future Enhancements

- **Enable CSRF Protection:** Integrate csurf middleware for cookie-based sessions.
- **Improve Logging and Monitoring:** Use Winston or Morgan along with external monitoring tools.
- **Expand Caching Strategies:** Implement caching for additional endpoints as needed.
- **Deployment Enhancements:** Containerize the application with Docker and use load balancers for production deployment.

## License

This project is licensed under the MIT License.
```

---

This README is now fully GitHub-compatible and includes sections about testing (including the comprehensive test file) and a note about Redis. Adjust any details as necessary for your project specifics. Let me know if you need further modifications!
