const {createToken} = require('../utils/token');

exports.showLogin = (req, res) => {
  const {redirect_uri} = req.query;
  if (!redirect_uri) return res.status(400).send("Missing redirect_uri");
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Login Using DIG</title>
      <style>
        body {
          margin: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f4f4f7;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        .login-container {
          background: white;
          padding: 2rem 3rem;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 400px;
        }
        h2 {
          margin-top: 0;
          text-align: center;
          color: #333;
        }
        input[type="email"] {
          width: 100%;
          padding: 0.75rem;
          margin: 1rem 0;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 1rem;
        }
        button {
          width: 100%;
          padding: 0.75rem;
          border: none;
          border-radius: 8px;
          background-color: #007bff;
          color: white;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        button:hover {
          background-color: #0056b3;
        }
        small {
          display: block;
          text-align: center;
          margin-top: 1rem;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="login-container">
        <h2>Login to Continue</h2>
        <form method="POST" action="/auth">
          <input type="email" name="email" placeholder="Enter your email" required />
          <input type="hidden" name="redirect_uri" value="${redirect_uri}" />
          <button type="submit">Log In</button>
        </form>
        <small>Powered by DIG</small>
      </div>
    </body>
    </html>
  `);
};

exports.handleLogin = (req, res) => {
  const {email, redirect_uri} = req.body;

  if (!email || !redirect_uri) {
    return res.status(400).send('Missing login details');
  }

  // Instead of redirecting, render the upload form directly:
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Upload Something</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: #f4f4f4;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        .container {
          background: white;
          padding: 2rem 3rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
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
  <input type="text" name="redirect_uri" value="${redirect_uri}" />
            <button type="submit">Upload</button>
        </form>

      </div>
    </body>
    </html>
  `);
};
