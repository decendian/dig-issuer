const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET 

exports.createToken = (user) => {
  return jwt.sign(user, secret, { expiresIn: '1h' });
};
exports.verifyToken = (token) => {
  try {
    console.log('Verifying token:', token);
    return jwt.verify(token, secret);
  } catch (error) {
    console.error('Error verifying token:', error);
    return { valid: false };
  }
};