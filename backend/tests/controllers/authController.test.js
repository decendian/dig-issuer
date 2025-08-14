const { showLogin, handleLogin } = require('../../controllers/authController');
const { FRONTEND_URL } = require('../../constants/urls');

jest.mock('../../constants/urls', () => ({
  FRONTEND_URL: 'http://localhost:3000'
}));

describe('AuthController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {},
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      redirect: jest.fn(),
      json: jest.fn()
    };
  });

  describe('showLogin', () => {
    it('should redirect to frontend auth page with redirect_uri', () => {
      req.query.redirect_uri = 'http://example.com/callback';

      showLogin(req, res);

      expect(res.redirect).toHaveBeenCalledWith(
        `http://localhost:3000/auth?redirect_uri=${encodeURIComponent('http://example.com/callback')}`
      );
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 400 if redirect_uri is missing', () => {
      showLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Missing redirect_uri');
      expect(res.redirect).not.toHaveBeenCalled();
    });

    it('should handle special characters in redirect_uri', () => {
      req.query.redirect_uri = 'http://example.com/callback?param=value&other=test';

      showLogin(req, res);

      expect(res.redirect).toHaveBeenCalledWith(
        `http://localhost:3000/auth?redirect_uri=${encodeURIComponent('http://example.com/callback?param=value&other=test')}`
      );
    });
  });

  describe('handleLogin', () => {
    it('should return success JSON with redirect URL when valid data provided', () => {
      req.body = {
        email: 'test@example.com',
        redirect_uri: 'http://example.com/callback'
      };

      handleLogin(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        redirectTo: `http://localhost:3000/upload?email=${encodeURIComponent('test@example.com')}&redirect_uri=${encodeURIComponent('http://example.com/callback')}`
      });
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 400 if email is missing', () => {
      req.body = {
        redirect_uri: 'http://example.com/callback'
      };

      handleLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Missing login details');
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should return 400 if redirect_uri is missing', () => {
      req.body = {
        email: 'test@example.com'
      };

      handleLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Missing login details');
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should return 400 if both email and redirect_uri are missing', () => {
      req.body = {};

      handleLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Missing login details');
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should handle special characters in email', () => {
      req.body = {
        email: 'test+special@example.com',
        redirect_uri: 'http://example.com/callback'
      };

      handleLogin(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        redirectTo: `http://localhost:3000/upload?email=${encodeURIComponent('test+special@example.com')}&redirect_uri=${encodeURIComponent('http://example.com/callback')}`
      });
    });
  });
});