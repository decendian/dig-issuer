//uploadController.js
const {createToken} = require("../utils/token");
exports.showUpload = (req, res) => {
  const { email, redirect_uri } = req.query;

  if (!redirect_uri) {
    return res.status(400).send('Missing parameters');
  }

  // I sm noy sure what this, we can remove it later
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Upload Something</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: #f9f9f9;
        }
        .container {
          background: white;
          padding: 2rem 3rem;
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
          max-width: 400px;
          width: 100%;
        }
        input[type="text"] {
          width: 100%;
          padding: 0.75rem;
          margin-bottom: 1rem;
          border: 1px solid #ccc;
          border-radius: 8px;
        }
        button {
          width: 100%;
          padding: 0.75rem;
          background-color: #28a745;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
        }
        button:hover {
          background-color: #218838;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Welcome, ${email}</h2>
        <form method="POST" action="/upload">
          <input type="text" name="data" placeholder="Enter anything..." required />
          <input type="hidden" name="email" value="${email}" />
          <input type="hidden" name="redirect_uri" value="${redirect_uri}" />
          <button type="submit">Upload</button>
        </form>
      </div>
    </body>
    </html>
  `);
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

