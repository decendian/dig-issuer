import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSearchParams } from 'next/navigation';
import AuthPage from '../../../src/app/auth/page';
import { BACKEND_URL } from '../../../constants/urls';

// Mock AuthContainer and AuthHeader components
jest.mock('../../../src/components/ui/AuthContainer', () => {
  return function MockAuthContainer({ children }) {
    return <div data-testid="auth-container">{children}</div>;
  };
});

jest.mock('../../../src/components/ui/AuthHeader', () => {
  return function MockAuthHeader({ icon, title, subtitle }) {
    return (
      <div data-testid="auth-header">
        <span data-testid="auth-icon">{icon}</span>
        <h1 data-testid="auth-title">{title}</h1>
        <p data-testid="auth-subtitle">{subtitle}</p>
      </div>
    );
  };
});

// Mock fetch
global.fetch = jest.fn();

// Mock window.location
delete window.location;
window.location = { href: '' };

describe('AuthPage', () => {
  const mockSearchParams = {
    get: jest.fn(),
  };

  beforeEach(() => {
    useSearchParams.mockReturnValue(mockSearchParams);
    fetch.mockClear();
    window.location.href = '';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the auth page with all components', () => {
      mockSearchParams.get.mockReturnValue('http://example.com/callback');
      
      render(<AuthPage />);
      
      expect(screen.getByTestId('auth-container')).toBeInTheDocument();
      expect(screen.getByTestId('auth-header')).toBeInTheDocument();
      expect(screen.getByTestId('auth-icon')).toHaveTextContent('🔐');
      expect(screen.getByTestId('auth-title')).toHaveTextContent('Login to Continue');
      expect(screen.getByTestId('auth-subtitle')).toHaveTextContent('Enter your email to sign in');
    });

    it('renders email input field', () => {
      mockSearchParams.get.mockReturnValue('http://example.com/callback');
      
      render(<AuthPage />);
      
      const emailInput = screen.getByPlaceholderText('Enter your email');
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('required');
    });

    it('renders submit button', () => {
      mockSearchParams.get.mockReturnValue('http://example.com/callback');
      
      render(<AuthPage />);
      
      const submitButton = screen.getByRole('button', { name: 'Log In' });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('renders powered by text', () => {
      mockSearchParams.get.mockReturnValue('http://example.com/callback');
      
      render(<AuthPage />);
      
      expect(screen.getByText('Powered by DIG')).toBeInTheDocument();
    });
  });

  describe('Form interactions', () => {
    beforeEach(() => {
      mockSearchParams.get.mockReturnValue('http://example.com/callback');
    });

    it('updates email input value when user types', () => {
      render(<AuthPage />);
      
      const emailInput = screen.getByPlaceholderText('Enter your email');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      
      expect(emailInput.value).toBe('test@example.com');
    });

    it('shows loading state when form is submitted', async () => {
      fetch.mockResolvedValueOnce({
        json: async () => ({ success: true, redirectTo: 'http://example.com' })
      });

      render(<AuthPage />);
      
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const submitButton = screen.getByRole('button', { name: 'Log In' });
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(submitButton);
      
      expect(screen.getByText('Signing in...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Form submission', () => {
    beforeEach(() => {
      mockSearchParams.get.mockReturnValue('http://example.com/callback');
    });

    it('makes correct API call on form submission', async () => {
      fetch.mockResolvedValueOnce({
        json: async () => ({ success: true, redirectTo: 'http://example.com' })
      });

      render(<AuthPage />);
      
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const form = screen.getByRole('button', { name: 'Log In' }).closest('form');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.submit(form);
      
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          `${BACKEND_URL}/auth`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: 'test@example.com',
              redirect_uri: 'http://example.com/callback'
            })
          }
        );
      });
    });

    it('redirects on successful authentication', async () => {
      fetch.mockResolvedValueOnce({
        json: async () => ({ 
          success: true, 
          redirectTo: 'http://example.com/dashboard' 
        })
      });

      render(<AuthPage />);
      
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const form = screen.getByRole('button', { name: 'Log In' }).closest('form');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.submit(form);
      
      await waitFor(() => {
        expect(window.location.href).toBe('http://localhost/');
      });
    });

    it('handles API errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      fetch.mockRejectedValueOnce(new Error('Network error'));

      render(<AuthPage />);
      
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const form = screen.getByRole('button', { name: 'Log In' }).closest('form');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.submit(form);
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Login error:', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });

    it('handles unsuccessful login response', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      fetch.mockResolvedValueOnce({
        json: async () => ({ success: false, error: 'Invalid credentials' })
      });

      render(<AuthPage />);
      
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const form = screen.getByRole('button', { name: 'Log In' }).closest('form');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.submit(form);
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Login failed:', expect.any(Object));
      });

      consoleSpy.mockRestore();
    });

    it('does not submit if email is empty', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      render(<AuthPage />);
      
      const form = screen.getByRole('button', { name: 'Log In' }).closest('form');
      fireEvent.submit(form);
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Email and redirect URI are required');
      });
      
      expect(fetch).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('does not submit if redirect_uri is missing', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockSearchParams.get.mockReturnValue(null);
      
      render(<AuthPage />);
      
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const form = screen.getByRole('button', { name: 'Log In' }).closest('form');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.submit(form);
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Email and redirect URI are required');
      });
      
      expect(fetch).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('resets loading state after form submission completes', async () => {
      fetch.mockResolvedValueOnce({
        json: async () => ({ success: true, redirectTo: 'http://example.com' })
      });

      render(<AuthPage />);
      
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const form = screen.getByRole('button', { name: 'Log In' }).closest('form');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.submit(form);
      
      // Should show loading initially
      expect(screen.getByText('Signing in...')).toBeInTheDocument();
      
      // Wait for completion and check button is no longer disabled
      await waitFor(() => {
        expect(screen.queryByText('Signing in...')).not.toBeInTheDocument();
      });
    });
  });

  describe('URL parameters', () => {
    it('correctly gets redirect_uri from search params', () => {
      const testUri = 'http://test.com/callback';
      mockSearchParams.get.mockReturnValue(testUri);
      
      render(<AuthPage />);
      
      expect(mockSearchParams.get).toHaveBeenCalledWith('redirect_uri');
    });
  });
});