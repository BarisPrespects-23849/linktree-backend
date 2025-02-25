Below is a revised GitHub-compatible README file with the installation instructions written in a plain, step-by-step format (without dropdowns):

---

```markdown
# Linktree-Style Backend with Referral & Reward System

A secure and scalable Node.js backend for a Linktree/Bento.me–style application. This project supports user registration, JWT-based authentication, a referral system with reward tracking, password reset functionality, and multiple security and performance enhancements. Comprehensive tests ensure that all features work as expected.

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
  - Users can register with email, username, and password.
  - Input validation for proper email format, password strength, and duplicate checks.
  - Unique referral code generation on registration.
  - Self-referral prevention: Users cannot refer themselves.

- **Login & Token Management**
  - Login via email or username.
  - JWT-based authentication issuing an **access token** (expires in 1 hour) and a **refresh token** (expires in 7 days).
  - Tokens are stored in HttpOnly cookies to prevent XSS.

- **Password Reset**
  - A "forgot password" endpoint allows users to request a reset.
  - (In production, this would send a secure, expiring token via email.)

- **Referral System & Reward Logic**
  - Track successful referrals using unique referral codes.
  - Award reward points to referrers upon successful referral.
  - Accurate tracking of referral counts.

- **Caching**
  - Redis caching is implemented (e.g., for referral data) to improve performance and reduce database load.

## Technologies

- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Caching:** Redis
- **Authentication:** JSON Web Tokens (JWT)
- **Security:** Helmet, express-rate-limit, cookie-parser, (optional: csurf)
- **Testing:** Jest, Supertest
- **Environment Management:** dotenv

## Installation

1. **Clone the Repository:**

   Open your terminal and run the following commands:
   
   ```
   git clone https://github.com/yourusername/linktree-backend.git
   cd linktree-backend
   ```

2. **Install Dependencies:**

   In the project directory, run:
   
   ```
   npm install
   ```

3. **Install and Run Redis (for Local Development):**

   - **macOS (using Homebrew):**
     
     Run:
     ```
     brew install redis
     redis-server
     ```
     
   - **Linux:**
     
     Run:
     ```
     sudo apt-get update
     sudo apt-get install redis-server
     sudo systemctl start redis
     ```
     
   - **Windows:**  
     
     If using Docker, run:
     ```
     docker run --name redis -p 6379:6379 -d redis
     ```

## Configuration

Create a `.env` file in the root directory of the project and add the following variables:

```
PORT=5001
NODE_ENV=development
DATABASE_URL=postgres://username:password@localhost:5432/yourdbname
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
REDIS_URL=redis://localhost:6379
```

- Replace `username`, `password`, and `yourdbname` with your actual PostgreSQL credentials.
- Generate secure strings for `JWT_SECRET` and `JWT_REFRESH_SECRET` (for example, using `openssl rand -base64 32`).

## Running the Application

To start the server, run the following command in your project directory:

```
npm start
```

The server will start on the port specified in your `.env` file (default is 5001).

## Testing

The project includes comprehensive integration and unit tests using Jest and Supertest. The tests cover:

- Registration (successful registration, duplicate email error)
- Login (successful login with token issuance, incorrect password error)
- Password reset
- Token refresh
- Protected endpoints (fetching referrals)
- Referral system logic (including invalid referral codes, self-referral prevention, and accurate referral count tracking)
- Custom validators for email, password, username, and referral code

To run all tests, execute:

```
npm test
```

### Redis Connection Note:
During testing, if the Redis connection remains open, Jest may not exit automatically. In our setup, if Redis is not closed by the tests, stopping the Redis service will allow Jest to exit properly. Ideally, you should call `redisClient.quit()` in your `afterAll` hook to ensure that all connections are closed.

## Challenges and Solutions

1. **Foreign Key Constraint Errors during Test Cleanup:**
   - **Problem:** Rows in the `referrals` and `rewards` tables referenced test users, causing deletion failures.
   - **Solution:** We updated the `referred_by` field to `NULL` for test users before deletion and ensured that we deleted from child tables (referrals and rewards) before deleting from the users table.

2. **Redis Connection Hanging Jest:**
   - **Problem:** An open Redis connection was preventing Jest from exiting.
   - **Solution:** We ensured that the Redis connection is properly closed (by calling `redisClient.quit()` in our cleanup or by manually stopping Redis) so that Jest exits automatically.

3. **Self-Referral Prevention:**
   - **Problem:** Users might attempt to refer themselves.
   - **Solution:** Our registration logic checks that the referral code owner’s email does not match the registering user's email, returning an error to prevent self-referral.

## Security & Performance Enhancements

- **Security:**
  - **SQL Injection Protection:** Parameterized queries are used.
  - **XSS Protection:** Helmet sets secure HTTP headers.
  - **Rate Limiting:** express-rate-limit is applied to critical endpoints to prevent brute-force attacks.
  - **Secure JWT Storage:** JWT tokens are stored in HttpOnly cookies, reducing exposure to XSS attacks.
  - **Input Validation:** Custom validators ensure that user inputs are sanitized.
  - **CSRF Protection:** (Optional) csurf middleware can be integrated if using cookie-based sessions.

- **Performance:**
  - **Redis Caching:** Caches frequently accessed data (e.g., referral data) to reduce database load.
  - **Scalability:** Stateless JWT authentication supports horizontal scaling and load balancing.

## Future Enhancements

- **Enable CSRF Protection:** Integrate csurf middleware for enhanced protection if using cookie-based sessions.
- **Improve Logging and Monitoring:** Use Winston or Morgan along with external monitoring tools.
- **Expand Caching Strategies:** Implement caching for additional endpoints as needed.
- **Deployment Enhancements:** Containerize the application with Docker and use load balancers for production deployment.

## License

This project is licensed under the MIT License.
```

---

This README file is now fully GitHub-compatible and includes plain-text installation instructions (without dropdowns), comprehensive project details, and testing instructions. Adjust any sections as needed for your specific project details before pushing it to your repository. Let me know if you need any further modifications!
