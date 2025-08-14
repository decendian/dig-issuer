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
    it('should render upload page with email and redirect_uri', () => {
      req.query = {
        email: 'test@example.com',
        redirect_uri: 'http://example.com/callback'
      };

      showUpload(req, res);

      expect(res.send).toHaveBeenCalled();
      const html = res.send.mock.calls[0][0];
      expect(html).toContain('Welcome, test@example.com');
      expect(html).toContain('value="test@example.com"');
      expect(html).toContain('value="http://example.com/callback"');
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 400 if redirect_uri is missing', () => {
      req.query = {
        email: 'test@example.com'
      };

      showUpload(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Missing parameters');
    });

    it('should render page even if email is missing', () => {
      req.query = {
        redirect_uri: 'http://example.com/callback'
      };

      showUpload(req, res);

      expect(res.send).toHaveBeenCalled();
      const html = res.send.mock.calls[0][0];
      expect(html).toContain('Welcome, undefined');
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should handle XSS attempts in email parameter', () => {
      req.query = {
        email: '<script>alert("xss")</script>',
        redirect_uri: 'http://example.com/callback'
      };

      showUpload(req, res);

      expect(res.send).toHaveBeenCalled();
      const html = res.send.mock.calls[0][0];
      // The HTML should contain the script tag as text, not as executable code
      expect(html).toContain('<script>alert("xss")</script>');
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

    it('should handle redirect_uri with existing query parameters', () => {
      const mockToken = 'mock-jwt-token';
      createToken.mockReturnValue(mockToken);
      
      req.body = {
        email: 'test@example.com',
        redirect_uri: 'http://example.com/callback?existing=param',
        data: 'some data'
      };

      handleUpload(req, res);

      expect(res.redirect).toHaveBeenCalledWith(
        `http://example.com/callback?existing=param?token=${mockToken}`
      );
    });
  });
});
