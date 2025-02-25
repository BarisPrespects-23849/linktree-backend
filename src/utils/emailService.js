// src/utils/emailService.js
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,      
  port: process.env.MAILTRAP_PORT,      
  auth: {
    user: process.env.MAILTRAP_USER,    
    pass: process.env.MAILTRAP_PASS,    
  },
});

/**
 * Sends a password reset email.
 * @param {string} email - The recipient's email address.
 * @param {string} resetLink 
 */
const sendPasswordResetEmail = async (email, resetLink) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.MAILTRAP_FROM || 'noreply@example.com', 
      to: email,
      subject: 'Password Reset Instructions',
      text: `Click the link to reset your password: ${resetLink}`,
    });
    console.log('Password reset email sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

module.exports = {
  sendPasswordResetEmail,
};
