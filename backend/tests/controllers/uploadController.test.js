const { showUpload, handleUpload } = require('../../controllers/uploadController');
const { createToken } = require('../../utils/token');

jest.mock('../../utils/token', () => ({
  createToken: jest.fn()
}));

describe('UploadController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {},
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      redirect: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('showUpload', () => {
    it('should return 400 if redirect_uri is missing', () => {
      req.query = {
        email: 'test@example.com'
      };

      showUpload(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Missing parameters');
    });

    it('should do nothing if redirect_uri is provided (email optional)', () => {
      req.query = {
        email: 'test@example.com',
        redirect_uri: 'http://example.com/callback'
      };

      showUpload(req, res);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
    });

    it('should work with redirect_uri provided but no email', () => {
      req.query = {
        redirect_uri: 'http://example.com/callback'
      };

      showUpload(req, res);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
    });
  });

  describe('handleUpload', () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    it('should create token and redirect with token parameter', () => {
      const mockToken = 'mock-jwt-token';
      createToken.mockReturnValue(mockToken);
      
      req.body = {
        email: 'test@example.com',
        redirect_uri: 'http://example.com/callback',
        data: 'some upload data'
      };

      handleUpload(req, res);

      expect(consoleLogSpy).toHaveBeenCalledWith('UPLOAD BODY:', req.body);
      expect(createToken).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(res.redirect).toHaveBeenCalledWith(
        `http://example.com/callback?token=${mockToken}`
      );
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 400 if email is missing', () => {
      req.body = {
        redirect_uri: 'http://example.com/callback',
        data: 'some data'
      };

      handleUpload(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Missing form data');
      expect(createToken).not.toHaveBeenCalled();
      expect(res.redirect).not.toHaveBeenCalled();
    });

    it('should return 400 if redirect_uri is missing', () => {
      req.body = {
        email: 'test@example.com',
        data: 'some data'
      };

      handleUpload(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Missing form data');
      expect(createToken).not.toHaveBeenCalled();
      expect(res.redirect).not.toHaveBeenCalled();
    });

    it('should return 400 if both email and redirect_uri are missing', () => {
      req.body = {
        data: 'some data'
      };

      handleUpload(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Missing form data');
      expect(createToken).not.toHaveBeenCalled();
      expect(res.redirect).not.toHaveBeenCalled();
    });

    it('should handle redirect_uri with existing query parameters (current behavior)', () => {
      const mockToken = 'mock-jwt-token';
      createToken.mockReturnValue(mockToken);
      
      req.body = {
        email: 'test@example.com',
        redirect_uri: 'http://example.com/callback?existing=param',
        data: 'some data'
      };

      handleUpload(req, res);

      // Matches the actual implementation — appends ?token= even after existing query
      expect(res.redirect).toHaveBeenCalledWith(
        `http://example.com/callback?existing=param?token=${mockToken}`
      );
    });
  });
});
