const QRcode = require('qrcode');
require('dotenv').config();

const BASE_IDENTIFIER = process.env.BASE_IDENTIFIER || 'DEFAULTBASE';

// Keep track of previously used numbers (this would normally be stored in DB)
const existingNumbers = new Set();

// Function to generate a unique random number
const generateUniqueRandomNumber = (existing) => {
  let randomNumber;
  do {
    randomNumber = Math.floor(Math.random() * 1000000000000000) + 1;
  } while (existing.has(randomNumber));
  existing.add(randomNumber);
  return randomNumber;
};

/**
 * Generates a unique QR code based on email and BASE_IDENTIFIER from env.
 * @param {string} email - The email to associate with the QR code.
 * @returns {Promise<{ qrCodeDataURL: string, identifier: string, email: string }>}
 */
const generateQRCodeFromEmail = async (email) => {
  if (!email || typeof email !== 'string') {
    throw new Error('Valid email is required.');
  }

  const uniqueSuffix = generateUniqueRandomNumber(existingNumbers);
  const identifier = `${BASE_IDENTIFIER}-${uniqueSuffix}`;
  const qrContent = `${identifier}:${email}`;

  try {
    const qrCodeDataURL = await QRcode.toDataURL(qrContent);

    return {
      qrCodeDataURL,
      identifier,
      email
    };
  } catch (error) {
    console.error('QR generation error:', error);
    throw new Error('QR code generation failed.');
  }
};

module.exports = {
  generateQRCodeFromEmail
};
