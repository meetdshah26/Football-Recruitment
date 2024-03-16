const crypto = require('crypto');

module.exports = (length) => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex') // Convert to hexadecimal
    .slice(0, length); // Trim to the desired length
};
