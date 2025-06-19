const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'secret';

exports.createToken = (user) => {
  return jwt.sign(user, secret, { expiresIn: '1h' });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, secret);
};