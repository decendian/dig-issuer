```
dig-issuer/backend/
├── app.js                 # Main entry point
├── routes/
│   ├── auth.js            # Login and token routes
│   └── userinfo.js        # Token-protected route for user info
├── controllers/
│   ├── authController.js  # Logic for login, redirect, token issuing
│   └── userController.js  # Logic for serving user info
├── models/
│   └── users.js           # Fake user database or user model
├── utils/
│   └── token.js           # Token generation & validation
├── .env                   # Secrets like JWT secret
├── package.json
└── README.md
```
