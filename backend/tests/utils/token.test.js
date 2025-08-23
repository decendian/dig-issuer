const jwt = require('jsonwebtoken');

// Mock jsonwebtoken module
jest.mock('jsonwebtoken');

// IMPORTANT: Set JWT_SECRET before importing the module
// because token.js captures it at import time
process.env.JWT_SECRET = 'test-secret-key';

// Now import after setting the env variable
const { createToken, verifyToken } = require('../../utils/token');

describe('Token Utilities', () => {
  const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Clean up
    delete process.env.JWT_SECRET;
  });

  describe('createToken', () => {
    it('should create a token with user data and 1h expiration', () => {
      const mockToken = 'mock.jwt.token';
      const user = { email: 'test@example.com', id: 123 };
      jwt.sign.mockReturnValue(mockToken);

      const token = createToken(user);

      expect(jwt.sign).toHaveBeenCalledWith(
        user,
        'test-secret-key',
        { expiresIn: '1h' }
      );
      expect(token).toBe(mockToken);
    });

    it('should handle empty user object', () => {
      const mockToken = 'mock.jwt.token';
      jwt.sign.mockReturnValue(mockToken);

      const token = createToken({});

      expect(jwt.sign).toHaveBeenCalledWith(
        {},
        'test-secret-key',
        { expiresIn: '1h' }
      );
      expect(token).toBe(mockToken);
    });

    it('should handle user with nested properties', () => {
      const mockToken = 'mock.jwt.token';
      const complexUser = {
        email: 'test@example.com',
        profile: {
          name: 'Test User',
          age: 30
        },
        permissions: ['read', 'write']
      };
      jwt.sign.mockReturnValue(mockToken);

      const token = createToken(complexUser);

      expect(jwt.sign).toHaveBeenCalledWith(
        complexUser,
        'test-secret-key',
        { expiresIn: '1h' }
      );
      expect(token).toBe(mockToken);
    });
    
    it('should throw error if jwt.sign fails', () => {
      const user = { email: 'test@example.com' };
      jwt.sign.mockImplementation(() => {
        throw new Error('Failed to sign token');
      });

      expect(() => createToken(user)).toThrow('Failed to sign token');
    });
  });

  describe('verifyToken', () => {
    it('should successfully verify a valid token', () => {
      const mockDecodedToken = {
        email: 'test@example.com',
        iat: 1234567890,
        exp: 1234571490
      };
      jwt.verify.mockReturnValue(mockDecodedToken);

      const result = verifyToken('valid.jwt.token');

      expect(consoleLogSpy).toHaveBeenCalledWith('Verifying token:', 'valid.jwt.token');
      expect(jwt.verify).toHaveBeenCalledWith('valid.jwt.token', 'test-secret-key');
      expect(result).toEqual(mockDecodedToken);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should return {valid: false} for invalid token', () => {
      const error = new Error('Invalid token');
      jwt.verify.mockImplementation(() => {
        throw error;
      });

      const result = verifyToken('invalid.token');

      expect(consoleLogSpy).toHaveBeenCalledWith('Verifying token:', 'invalid.token');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error verifying token:', error);
      expect(result).toEqual({ valid: false });
    });

    it('should return {valid: false} for expired token', () => {
      const error = new jwt.TokenExpiredError('Token expired', new Date());
      jwt.verify.mockImplementation(() => {
        throw error;
      });

      const result = verifyToken('expired.token');

      expect(consoleLogSpy).toHaveBeenCalledWith('Verifying token:', 'expired.token');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error verifying token:', error);
      expect(result).toEqual({ valid: false });
    });

    it('should return {valid: false} for malformed token', () => {
      const error = new jwt.JsonWebTokenError('Malformed token');
      jwt.verify.mockImplementation(() => {
        throw error;
      });

      const result = verifyToken('malformed.token');

      expect(consoleLogSpy).toHaveBeenCalledWith('Verifying token:', 'malformed.token');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error verifying token:', error);
      expect(result).toEqual({ valid: false });
    });

    it('should handle undefined token', () => {
      const error = new Error('jwt must be provided');
      jwt.verify.mockImplementation(() => {
        throw error;
      });

      const result = verifyToken(undefined);

      expect(consoleLogSpy).toHaveBeenCalledWith('Verifying token:', undefined);
      expect(jwt.verify).toHaveBeenCalledWith(undefined, 'test-secret-key');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error verifying token:', error);
      expect(result).toEqual({ valid: false });
    });

    it('should handle null token', () => {
      const error = new Error('jwt must be provided');
      jwt.verify.mockImplementation(() => {
        throw error;
      });

      const result = verifyToken(null);

      expect(consoleLogSpy).toHaveBeenCalledWith('Verifying token:', null);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error verifying token:', error);
      expect(result).toEqual({ valid: false });
    });

    it('should handle empty string token', () => {
      const error = new Error('jwt must be provided');
      jwt.verify.mockImplementation(() => {
        throw error;
      });

      const result = verifyToken('');

      expect(consoleLogSpy).toHaveBeenCalledWith('Verifying token:', '');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error verifying token:', error);
      expect(result).toEqual({ valid: false });
    });
  });

  describe('Integration scenarios', () => {
    it('should handle token creation and verification flow', () => {
      // For integration test, we'll test the mock behavior matches expected flow
      const user = { email: 'integration@test.com', role: 'admin' };
      const mockToken = 'integration.jwt.token';
      const mockDecoded = { ...user, iat: 1234567890, exp: 1234571490 };
      
      // Setup mocks for full flow
      jwt.sign.mockReturnValue(mockToken);
      jwt.verify.mockReturnValue(mockDecoded);

      // Create token
      const token = createToken(user);
      expect(token).toBe(mockToken);

      // Verify the created token
      const verified = verifyToken(token);
      expect(verified).toEqual(mockDecoded);
      expect(verified.email).toBe(user.email);
      expect(verified.role).toBe(user.role);
    });

    it('should properly handle error in the full flow', () => {
      const user = { email: 'test@test.com' };
      const mockToken = 'mock.token';
      
      jwt.sign.mockReturnValue(mockToken);
      jwt.verify.mockImplementation(() => {
        throw new Error('Token verification failed');
      });

      const token = createToken(user);
      const verified = verifyToken(token);

      expect(verified).toEqual({ valid: false });
    });
  });
});