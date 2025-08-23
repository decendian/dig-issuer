import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useSearchParams } from 'next/navigation';
import AuthCallback from '../../../src/app/auth-callback/page'; // Updated path

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

// Mock window methods
const mockPostMessage = jest.fn();
const mockClose = jest.fn();

Object.defineProperty(window, 'opener', {
  value: {
    postMessage: mockPostMessage,
  },
  writable: true,
});

Object.defineProperty(window, 'close', {
  value: mockClose,
  writable: true,
});

describe('AuthCallback', () => {
  const mockSearchParams = {
    get: jest.fn(),
  };

  beforeEach(() => {
    useSearchParams.mockReturnValue(mockSearchParams);
    mockPostMessage.mockClear();
    mockClose.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the processing message', () => {
      mockSearchParams.get.mockReturnValue('test-token');
      
      render(<AuthCallback />);
      
      expect(screen.getByText('Processing authentication...')).toBeInTheDocument();
    });

    it('renders loading fallback initially', () => {
      render(<AuthCallback />);
      
      expect(screen.getByText('Processing authentication...')).toBeInTheDocument();
    });
  });

  describe('Authentication processing', () => {
    it('posts message to opener window when token exists and opener is available', async () => {
      const testToken = 'test-auth-token-123';
      mockSearchParams.get.mockReturnValue(testToken);
      
      render(<AuthCallback />);
      
      await waitFor(() => {
        expect(mockSearchParams.get).toHaveBeenCalledWith('token');
        expect(mockPostMessage).toHaveBeenCalledWith(
          {
            type: 'SSO_SUCCESS',
            token: testToken
          },
          '*'
        );
      });
    });

    it('closes the window after processing', async () => {
      const testToken = 'test-auth-token-123';
      mockSearchParams.get.mockReturnValue(testToken);
      
      render(<AuthCallback />);
      
      await waitFor(() => {
        expect(mockClose).toHaveBeenCalled();
      });
    });

    it('does not post message when token is null', async () => {
      mockSearchParams.get.mockReturnValue(null);
      
      render(<AuthCallback />);
      
      await waitFor(() => {
        expect(mockSearchParams.get).toHaveBeenCalledWith('token');
        expect(mockPostMessage).not.toHaveBeenCalled();
      });
      
      // Should still close the window
      expect(mockClose).toHaveBeenCalled();
    });

    it('does not post message when token is empty string', async () => {
      mockSearchParams.get.mockReturnValue('');
      
      render(<AuthCallback />);
      
      await waitFor(() => {
        expect(mockSearchParams.get).toHaveBeenCalledWith('token');
        expect(mockPostMessage).not.toHaveBeenCalled();
      });
      
      // Should still close the window
      expect(mockClose).toHaveBeenCalled();
    });

    it('does not post message when opener is not available', async () => {
      const testToken = 'test-auth-token-123';
      mockSearchParams.get.mockReturnValue(testToken);
      
      // Mock window.opener as null
      Object.defineProperty(window, 'opener', {
        value: null,
        writable: true,
      });
      
      render(<AuthCallback />);
      
      await waitFor(() => {
        expect(mockSearchParams.get).toHaveBeenCalledWith('token');
        expect(mockPostMessage).not.toHaveBeenCalled();
      });
      
      // Should still close the window
      expect(mockClose).toHaveBeenCalled();
    });

    it('handles undefined opener gracefully', async () => {
      const testToken = 'test-auth-token-123';
      mockSearchParams.get.mockReturnValue(testToken);
      
      // Mock window.opener as undefined
      Object.defineProperty(window, 'opener', {
        value: undefined,
        writable: true,
      });
      
      render(<AuthCallback />);
      
      await waitFor(() => {
        expect(mockSearchParams.get).toHaveBeenCalledWith('token');
        expect(mockPostMessage).not.toHaveBeenCalled();
      });
      
      // Should still close the window
      expect(mockClose).toHaveBeenCalled();
    });

    it('uses wildcard origin for postMessage', async () => {
      const testToken = 'test-auth-token-123';
      mockSearchParams.get.mockReturnValue(testToken);
      
      // Restore opener for this test
      Object.defineProperty(window, 'opener', {
        value: {
          postMessage: mockPostMessage,
        },
        writable: true,
      });
      
      render(<AuthCallback />);
      
      await waitFor(() => {
        expect(mockPostMessage).toHaveBeenCalledWith(
          expect.any(Object),
          '*'
        );
      });
    });
  });

  describe('Effect behavior', () => {
    it('runs effect on component mount', async () => {
      const testToken = 'mount-token';
      mockSearchParams.get.mockReturnValue(testToken);
      
      render(<AuthCallback />);
      
      await waitFor(() => {
        expect(mockPostMessage).toHaveBeenCalledWith(
          {
            type: 'SSO_SUCCESS',
            token: testToken
          },
          '*'
        );
      });
    });

    it('handles missing searchParams gracefully', async () => {
      mockSearchParams.get.mockReturnValue(null);
      
      render(<AuthCallback />);
      
      await waitFor(() => {
        expect(mockClose).toHaveBeenCalled();
      });
      
      expect(mockPostMessage).not.toHaveBeenCalled();
    });
  });

  describe('Message format', () => {
    it('sends correct message structure', async () => {
      const testToken = 'abc123xyz';
      mockSearchParams.get.mockReturnValue(testToken);
      
      Object.defineProperty(window, 'opener', {
        value: {
          postMessage: mockPostMessage,
        },
        writable: true,
      });
      
      render(<AuthCallback />);
      
      await waitFor(() => {
        expect(mockPostMessage).toHaveBeenCalledWith(
          {
            type: 'SSO_SUCCESS',
            token: 'abc123xyz'
          },
          '*'
        );
      });
    });

    it('preserves token value exactly as received', async () => {
      const complexToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.signature';
      mockSearchParams.get.mockReturnValue(complexToken);
      
      Object.defineProperty(window, 'opener', {
        value: {
          postMessage: mockPostMessage,
        },
        writable: true,
      });
      
      render(<AuthCallback />);
      
      await waitFor(() => {
        expect(mockPostMessage).toHaveBeenCalledWith(
          {
            type: 'SSO_SUCCESS',
            token: complexToken
          },
          '*'
        );
      });
    });
  });
});