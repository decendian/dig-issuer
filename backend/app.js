const express = require('express');
const cors = require('cors');
const { FRONTEND_URL, BACKEND_URL } = require('./constants/urls');
const app = express();
require('dotenv').config();

// Add CORS middleware before other middleware
app.use(cors({
  origin: FRONTEND_URL, // Allow requests from Next.js
  credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/auth', require('./routes/auth'));
app.use('/userinfo', require('./routes/userinfo'));
app.use('/upload', require('./routes/upload'));

app.listen(3001, () => console.log(`SSO running on ${BACKEND_URL}`));