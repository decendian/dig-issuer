//uploadController.js
const {createToken} = require("../utils/token");
exports.showUpload = (req, res) => {
  const { email, redirect_uri } = req.query;

  if (!redirect_uri) {
    return res.status(400).send('Missing parameters');
  }
};

exports.handleUpload = (req, res) => {
  const { email, redirect_uri } = req.body;

  console.log('UPLOAD BODY:', req.body); // debug log

  if (!email || !redirect_uri) {
    return res.status(400).send('Missing form data');
  }

  const token = createToken({ email });

  return res.redirect(`${redirect_uri}?token=${token}`);
};

