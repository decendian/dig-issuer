const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/auth', require('./routes/auth'));
app.use('/userinfo', require('./routes/userinfo'));
app.use('/upload', require('./routes/upload'));
app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => console.log('SSO running on http://localhost:3000'));



