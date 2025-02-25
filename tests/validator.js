// tests/validator.test.js

const {
    validateEmail,
    validatePassword,
    validateUsername,
    validateReferralCode
  } = require('../src/utils/validator');
  
  describe('Custom Validators', () => {
    // Email Validation Tests
    test('validateEmail returns true for a valid email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
    });
  
    test('validateEmail returns false for an invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(false);
    });
  
    // Password Validation Tests
    test('validatePassword returns true for a strong password', () => {
      expect(validatePassword('Password123')).toBe(true);
    });
  
    test('validatePassword returns false for a weak password', () => {
      expect(validatePassword('pass')).toBe(false);
    });
  
    // Username Validation Tests
    test('validateUsername returns true for a non-empty username', () => {
      expect(validateUsername('testuser')).toBe(true);
    });
  
    test('validateUsername returns false for an empty username', () => {
      expect(validateUsername('')).toBe(false);
    });
  
    // Referral Code Validation Tests
    if (typeof validateReferralCode === 'function') {
      test('validateReferralCode returns true for a valid referral code', () => {
        // Assuming a valid referral code follows the pattern: <username>-<6 lowercase alphanumeric characters>
        expect(validateReferralCode('testuser-abc123')).toBe(true);
      });
  
      test('validateReferralCode returns false for a referral code missing the dash', () => {
        expect(validateReferralCode('testuserabc123')).toBe(false);
      });
  
      test('validateReferralCode returns false for a referral code with invalid characters', () => {
        expect(validateReferralCode('testuser-abc!23')).toBe(false);
      });
  
      test('validateReferralCode returns false for an empty referral code', () => {
        expect(validateReferralCode('')).toBe(false);
      });
  
      test('validateReferralCode returns false for a referral code that is too short', () => {
        // For example, if we expect exactly 6 characters after the dash
        expect(validateReferralCode('testuser-ab12')).toBe(false);
      });
    }
  });
  