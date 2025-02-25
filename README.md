Below is a revised and polished README file for your GitHub repository:

---

```markdown
# Linktree-Style Backend with Referral & Reward System

A secure, scalable Node.js backend for a Linktree/Bento.me–style application. This project provides user registration, authentication with JWT (including access and refresh tokens stored in HttpOnly cookies), password reset functionality, and a referral system with reward tracking and caching using Redis. It also includes comprehensive tests to ensure that all features work correctly.

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
  - Register using email, username, and password with full input validation.
  - Duplicate email/username checks.
  - Unique referral code generation for each user.
  - Self-referral prevention (a user cannot refer themselves).
  
- **Login & Token Management**
  - Login with email or username.
  - JWT-based authentication issuing an access token (1 hour expiry) and a refresh token (7 days expiry).
  - Tokens are set in HttpOnly cookies to protect against XSS.

- **Password Reset**
  - Forgot password endpoint to request a reset (in production, this would trigger sending a secure, expiring token via email).

- **Referral System & Reward Logic**
  - Track successful referrals using unique referral codes.
  - Award reward points to referrers upon successful sign-ups.
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

The project includes comprehensive tests using Jest and Supertest to verify:

- Registration (successful registration, duplicate email handling)
- Login (successful login with token issuance and failure on incorrect credentials)
- Password reset
- Token refresh
- Protected endpoints (fetching referrals)
- Referral system functionality (valid referrals, invalid referral codes, self-referral prevention, referral count tracking)
- Custom validators (unit tests for email, password, username, and referral code)

To run the tests:

```bash
npm test
```

**Important Redis Note:**  
During testing, if Redis remains running with an open connection, Jest might not exit automatically. To fix this, ensure that you either close the Redis connection in your `afterAll` hook (e.g., call `redisClient.quit()`) or stop the Redis service manually after tests. In our setup, stopping Redis allowed the tests to exit properly.

## Challenges and Solutions

- **Foreign Key Constraint Errors during Test Cleanup:**  
  - *Problem:* Rows in the `referrals` and `rewards` tables referenced test users, causing cleanup failures.  
  - *Solution:* We update the `referred_by` field to `NULL` for test users before deletion and delete from child tables (referrals, rewards) before deleting from the users table.

- **Redis Connection Preventing Jest from Exiting:**  
  - *Problem:* An open Redis connection was preventing Jest from exiting.  
  - *Solution:* We ensured that the Redis connection is properly closed (using `redisClient.quit()` in our cleanup or stopping Redis manually) so that Jest exits automatically.

- **Self-Referral Prevention:**  
  - *Problem:* Users might try to refer themselves.  
  - *Solution:* Our registration logic checks that the referral code owner’s email does not match the registering user’s email, preventing self-referral.

## Security & Performance Enhancements

- **Security Enhancements:**
  - **Helmet:** Sets secure HTTP headers.
  - **Rate Limiting:** Uses express-rate-limit on critical endpoints to prevent brute-force attacks.
  - **SQL Injection Protection:** Uses parameterized queries with PostgreSQL.
  - **Secure JWT Storage:** Tokens are stored in HttpOnly cookies to protect against XSS.
  - **Input Validation:** Custom validators prevent malicious input (SQL injection, XSS).

- **Performance Enhancements:**
  - **Redis Caching:** Caches frequently accessed data (like referral data) to reduce database load.
  - **Scalability:** Stateless JWT authentication supports horizontal scaling and load balancing.
  
## Future Enhancements

- **Enable CSRF Protection:**  
  Integrate csurf middleware for cookie-based sessions.
- **Improve Logging and Monitoring:**  
  Use Winston or Morgan and external monitoring tools.
- **Expand Caching Strategies:**  
  Implement caching for additional endpoints.
- **Deployment Improvements:**  
  Containerize the application with Docker and use load balancers for production deployment.

## License

This project is licensed under the MIT License.
```

---

This README file now covers all project requirements, explains the challenges and solutions we faced (including the Redis connection issue), and clearly outlines how to test and run the application. Feel free to customize any sections as needed. Let me know if you have any further questions or require additional modifications!
