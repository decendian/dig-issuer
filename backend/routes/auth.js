const express = require('express');
const router = express.Router();
const { showLogin, handleLogin } = require('../controllers/authController');

router.get('/', showLogin);       // /auth?redirect_uri=...
router.post('/', handleLogin);    // handles login and redirects back

module.exports = router;

