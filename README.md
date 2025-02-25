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
  - Tokens are stored in HttpOnly cookies to prevent XSS.

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
