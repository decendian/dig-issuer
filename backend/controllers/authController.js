// authController.js
// const {createToken} = require('../utils/token');
const { FRONTEND_URL } = require('../constants/urls');

exports.showLogin = (req, res) => {
  //Add proper logging here and more checks for a good request
  const {redirect_uri} = req.query;
  if (!redirect_uri) return res.status(400).send("Missing redirect_uri");
  
  // Redirect to Next.js auth page instead of serving HTML
  res.redirect(`${FRONTEND_URL}/auth?redirect_uri=${encodeURIComponent(redirect_uri)}`);
};

exports.handleLogin = (req, res) => {
  const {email, redirect_uri} = req.body;

  if (!email || !redirect_uri) {
    return res.status(400).send('Missing login details');
  }

  // Return JSON instead of redirecting
  res.json({
    success: true,
    redirectTo: `${FRONTEND_URL}/upload?email=${encodeURIComponent(email)}&redirect_uri=${encodeURIComponent(redirect_uri)}`
  });
};