require('dotenv').config();
const FRONTEND_URL = process.env.FRONTEND_URL;
const BACKEND_URL = process.env.BACKEND_URL;

module.exports = {
  FRONTEND_URL,
  BACKEND_URL
};