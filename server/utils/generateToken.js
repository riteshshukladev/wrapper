// utils/generateToken.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Generates a JWT token.
 * @param {Object} payload - The payload to encode in the token.
 * @param {String} secret - The secret key to sign the token.
 * @param {String} expiresIn - Token expiration time.
 * @returns {String} - The signed JWT token.
 */
const generateToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};

module.exports = generateToken;
