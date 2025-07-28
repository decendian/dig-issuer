// userController.js
const { verifyToken } = require('../utils/token');

exports.getUserInfo = (req, res) => {
  const auth = req.headers.authorization;
  const token = auth?.split(' ')[1];

  try {
    const user = verifyToken(token);
    res.json({ email: user.email,
                iat: user.iat,
                exp: user.exp});
  } catch {
    res.status(401).send('Invalid token');
  }
};
