// tests/test.js

// Increase timeout for long-running tests (optional)
jest.setTimeout(30000);

const request = require('supertest');
const app = require('../server'); // Your Express app should be exported from server.js
const db = require('../src/models/db');

// Define our test emails
const testEmails = [
  'test1@example.com',
  'referrer@example.com',
  'referred@example.com',
  'invalidreferral@example.com',
  'selfreferral@example.com',
  'selfreferral2@example.com',
  'trackreferrer@example.com',
  'referredone@example.com',
  'referredtwo@example.com'
];

// Helper function to format an array of emails for SQL IN clause
const formatEmailList = (emails) => emails.map(email => `'${email}'`).join(', ');

describe('API Integration Tests', () => {
  let accessToken, refreshToken;
  let referrerId; // For reward system testing

  // Before all tests: Clean up any test data.
  beforeAll(async () => {

    await db.query(`
      UPDATE users
      SET referred_by = NULL
      WHERE id IN (
        SELECT id FROM users
        WHERE email IN (${formatEmailList(testEmails)})
      )
    `);

    // Step 2: Delete from dependent tables first.
    // Delete from referrals where either referred_user_id OR referrer_id is in our test set.
    await db.query(`
      DELETE FROM referrals
      WHERE referred_user_id IN (
        SELECT id FROM users
        WHERE email IN (${formatEmailList(testEmails)})
      )
      OR referrer_id IN (
        SELECT id FROM users
        WHERE email IN (${formatEmailList(testEmails)})
      )
    `);

    // Delete from rewards.
    await db.query(`
      DELETE FROM rewards
      WHERE user_id IN (
        SELECT id FROM users
        WHERE email IN (${formatEmailList(testEmails)})
      )
    `);

    // Step 3: Finally, delete the test users.
    await db.query(`
      DELETE FROM users
      WHERE email IN (${formatEmailList(testEmails)})
    `);
  });

  // After all tests: Clean up test data in the same order.
  afterAll(async () => {
    // Clear self-references in case any remain.
    await db.query(`
      UPDATE users
      SET referred_by = NULL
      WHERE id IN (
        SELECT id FROM users
        WHERE email IN (${formatEmailList(testEmails)})
      )
    `);
  
    // Delete from referrals (both referenced columns).
    await db.query(`
      DELETE FROM referrals
      WHERE referred_user_id IN (
        SELECT id FROM users
        WHERE email IN (${formatEmailList(testEmails)})
      )
      OR referrer_id IN (
        SELECT id FROM users
        WHERE email IN (${formatEmailList(testEmails)})
      )
    `);
  
    // Delete from rewards.
    await db.query(`
      DELETE FROM rewards
      WHERE user_id IN (
        SELECT id FROM users
        WHERE email IN (${formatEmailList(testEmails)})
      )
    `);
  
    // Delete test users.
    await db.query(`
      DELETE FROM users
      WHERE email IN (${formatEmailList(testEmails)})
    `);
  
    // Close the database connection if available.
    if (typeof db.end === 'function') {
      await db.end();
    }
  
    // If you're using Redis caching, close that connection as well.
    try {
      const redisClient = require('../src/utils/cache');
      if (redisClient && typeof redisClient.quit === 'function') {
        await redisClient.quit();
      }
    } catch (err) {
      console.error('Error closing Redis connection:', err);
    }
  });
  

  // --- Registration Tests ---
  it('should register a new user successfully (no referral)', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        username: 'testuser',
        email: 'test1@example.com',
        password: 'Password123'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('user');
  });

  it('should not register a user with duplicate email', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        username: 'testuser2',
        email: 'test1@example.com', // Duplicate email
        password: 'Password123'
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  // --- Login Tests ---
  it('should login successfully and return access & refresh tokens', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        identifier: 'testuser',
        password: 'Password123'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  it('should fail login with incorrect password', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        identifier: 'testuser',
        password: 'WrongPassword'
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  // --- Forgot Password Test ---
  it('should request a password reset', async () => {
    const res = await request(app)
      .post('/api/forgot-password')
      .send({ email: 'test1@example.com' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
  });

  // --- Token Refresh Test ---
  it('should refresh the access token using the refresh token', async () => {
    const res = await request(app)
      .post('/api/token')
      .send({ token: refreshToken });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('accessToken');
    accessToken = res.body.accessToken; // update for subsequent tests
  });

  // --- Protected Endpoint Test: Fetch Referrals ---
  it('should fetch referrals when provided a valid token', async () => {
    const res = await request(app)
      .get('/api/referrals')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('referrals');
  });

  it('should return unauthorized when token is missing for referrals', async () => {
    const res = await request(app).get('/api/referrals');
    expect(res.statusCode).toEqual(401);
  });

  // --- Reward System Test ---
  it('should register a new user with a valid referral code and award reward points to the referrer', async () => {
    // Register the referrer
    const referrerRes = await request(app)
      .post('/api/register')
      .send({
        username: 'referrer',
        email: 'referrer@example.com',
        password: 'Password123'
      });
    expect(referrerRes.statusCode).toEqual(201);
    const referrer = referrerRes.body.user;
    referrerId = referrer.id;

    // Register the referred user using the referrer's referral code
    const referredRes = await request(app)
      .post('/api/register')
      .send({
        username: 'referred',
        email: 'referred@example.com',
        password: 'Password123',
        referralCode: referrer.referral_code
      });
    expect(referredRes.statusCode).toEqual(201);
    expect(referredRes.body).toHaveProperty('user');

    // Verify that a reward record exists for the referrer
    const rewardRes = await db.query('SELECT * FROM rewards WHERE user_id = $1', [referrer.id]);
    expect(rewardRes.rows.length).toBeGreaterThan(0);
  });

  // --- Additional Referral System Edge Case Tests ---
  it('should fail registration with an invalid referral code', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        username: 'invalidreferral',
        email: 'invalidreferral@example.com',
        password: 'Password123',
        referralCode: 'nonexistent-code'
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should prevent self-referral by returning an error when the referral code belongs to the same email', async () => {
    // Register a user (the "referrer")
    const userRes = await request(app)
      .post('/api/register')
      .send({
        username: 'selfreferral',
        email: 'selfreferral@example.com',
        password: 'Password123'
      });
    expect(userRes.statusCode).toEqual(201);
    const user = userRes.body.user;
  
    // Attempt to register another account with the same email using the referrer's referral code.
    const selfReferralRes = await request(app)
      .post('/api/register')
      .send({
        username: 'selfreferral2',
        email: 'selfreferral@example.com', // Same email as the original user
        password: 'Password123',
        referralCode: user.referral_code
      });
    // Expect error due to duplicate email (and our business logic preventing self-referral)
    expect(selfReferralRes.statusCode).toEqual(400);
    expect(selfReferralRes.body).toHaveProperty('error');
  });

  it('should accurately track referral counts', async () => {
    // Register a referrer
    const referrerRes = await request(app)
      .post('/api/register')
      .send({
        username: 'trackreferrer',
        email: 'trackreferrer@example.com',
        password: 'Password123'
      });
    expect(referrerRes.statusCode).toEqual(201);
    const referrer = referrerRes.body.user;

    // Register two referred users using the referrer's referral code
    const referredOneRes = await request(app)
      .post('/api/register')
      .send({
        username: 'referredOne',
        email: 'referredone@example.com',
        password: 'Password123',
        referralCode: referrer.referral_code
      });
    expect(referredOneRes.statusCode).toEqual(201);

    const referredTwoRes = await request(app)
      .post('/api/register')
      .send({
        username: 'referredTwo',
        email: 'referredtwo@example.com',
        password: 'Password123',
        referralCode: referrer.referral_code
      });
    expect(referredTwoRes.statusCode).toEqual(201);

    // Verify that the referral count for the referrer is 2
    const referralCountRes = await db.query(
      'SELECT COUNT(*) AS count FROM referrals WHERE referrer_id = $1 AND status = $2',
      [referrer.id, 'successful']
    );
    expect(Number(referralCountRes.rows[0].count)).toEqual(2);
  });
});
