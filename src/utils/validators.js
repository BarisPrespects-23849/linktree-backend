// src/utils/validator.js

/**
 * Validates an email address using a regular expression.
 * @param {string} email - The email address to validate.
 * @returns {boolean} - Returns true if the email is valid.
 */
const validateEmail = (email) => {
    const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return re.test(String(email).toLowerCase());
  };
  
  /**
   * Validates a password ensuring it is at least 6 characters long and includes letters and numbers.
   * You can customize this regex based on your requirements.
   * @param {string} password - The password to validate.
   * @returns {boolean} - Returns true if the password is valid.
   */
  const validatePassword = (password) => {
    // Example: minimum 6 characters, at least one letter and one number
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return re.test(password);
  };
  
  /**
   * Validates that the username is a non-empty string.
   * @param {string} username - The username to validate.
   * @returns {boolean} - Returns true if the username is valid.
   */
  const validateUsername = (username) => {
    return typeof username === 'string' && username.trim().length > 0;
  };
  
  module.exports = {
    validateEmail,
    validatePassword,
    validateUsername,
  };
  