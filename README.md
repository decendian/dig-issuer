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

Make sure to add a .env file of this format into the backend folder:

```
JWT_SECRET= YOUR_KEY
FRONTEND_URL= YOUR_FRONTEND_URL
BACKEND_URL= YOUR_BACKEND_URL
```
