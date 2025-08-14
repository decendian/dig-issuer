const { getUserInfo } = require('../../controllers/userController');
const { verifyToken } = require('../../utils/token');

jest.mock('../../utils/token', () => ({
  verifyToken: jest.fn()
}));

describe('UserController', () => {
  let req, res;
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('getUserInfo', () => {
    it('should return user info when valid token is provided', () => {
      const mockUser = {
        email: 'test@example.com',
        iat: 1234567890,
        exp: 1234567900
      };
      verifyToken.mockReturnValue(mockUser);
      
      req.headers.authorization = 'Bearer valid-token';

      getUserInfo(req, res);

      expect(verifyToken).toHaveBeenCalledWith('valid-token');
      expect(res.json).toHaveBeenCalledWith({
        email: 'test@example.com',
        iat: 1234567890,
        exp: 1234567900
      });
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 401 when authorization header is missing', () => {
      verifyToken.mockImplementation(() => {
        throw new Error('Token is undefined');
      });

      getUserInfo(req, res);

      expect(verifyToken).toHaveBeenCalledWith(undefined);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error verifying token:',
        expect.any(Error)
      );
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith('Invalid token');
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should return 401 when token is invalid', () => {
      verifyToken.mockImplementation(() => {
        throw new Error('Invalid token');
      });
      
      req.headers.authorization = 'Bearer invalid-token';

      getUserInfo(req, res);

      expect(verifyToken).toHaveBeenCalledWith('invalid-token');
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error verifying token:',
        expect.any(Error)
      );
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith('Invalid token');
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should handle malformed authorization header', () => {
      verifyToken.mockImplementation(() => {
        throw new Error('Token is undefined');
      });
      
      req.headers.authorization = 'InvalidFormat';

      getUserInfo(req, res);

      expect(verifyToken).toHaveBeenCalledWith(undefined);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith('Invalid token');
    });

    it('should handle authorization header without Bearer prefix', () => {
      verifyToken.mockImplementation(() => {
        throw new Error('Token is undefined');
      });
      
      req.headers.authorization = 'just-a-token';

      getUserInfo(req, res);

      expect(verifyToken).toHaveBeenCalledWith(undefined);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith('Invalid token');
    });

    it('should return user info with all token claims', () => {
      const mockUser = {
        email: 'user@example.com',
        iat: 1609459200,
        exp: 1609545600,
        additional: 'should not be included'
      };
      verifyToken.mockReturnValue(mockUser);
      
      req.headers.authorization = 'Bearer valid-token';

      getUserInfo(req, res);

      expect(res.json).toHaveBeenCalledWith({
        email: 'user@example.com',
        iat: 1609459200,
        exp: 1609545600
      });
      // Should not include additional property
      expect(res.json.mock.calls[0][0]).not.toHaveProperty('additional');
    });
  });
});
