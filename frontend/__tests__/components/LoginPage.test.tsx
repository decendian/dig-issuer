import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import LoginPage from '../../src/components/LoginPage';

// Since mocking window.location in jsdom is problematic, 
// we'll focus on testing the core functionality without the redirect
// The redirect is a simple assignment and doesn't need extensive testing

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock console.log and console.error
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    mockConsoleLog.mockClear();
    mockConsoleError.mockClear();
  });

  describe('Rendering', () => {
    test('renders login form with all elements', () => {
      render(<LoginPage />);
      
      expect(screen.getByText('Welcome back')).toBeInTheDocument();
      expect(screen.getByText('Sign in to your account to continue')).toBeInTheDocument();
      expect(screen.getByLabelText('Email address')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
      expect(screen.getByText('Remember me')).toBeInTheDocument();
      expect(screen.getByText('Forgot your password?')).toBeInTheDocument();
      expect(screen.getByText('Create a new account')).toBeInTheDocument();
    });

    test('renders with correct placeholders', () => {
      render(<LoginPage />);
      
      expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    test('shows error when email is empty', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);
      
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    test('shows error when email format is invalid', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText('Email address');
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      await user.type(emailInput, 'invalid-email');
      await user.click(submitButton);
      
      expect(screen.getByText('Email is invalid')).toBeInTheDocument();
    });

    test('shows error when password is empty', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);
      
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });

    test('shows error when password is too short', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText('Email address');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, '123');
      await user.click(submitButton);
      
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });

    test('clears errors when user starts typing', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText('Email address');
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      // Trigger error
      await user.click(submitButton);
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      
      // Start typing - error should clear
      await user.type(emailInput, 't');
      expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
    });
  });

  describe('Password Visibility Toggle', () => {
    test('toggles password visibility when eye icon is clicked', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      const passwordInput = screen.getByLabelText('Password');
      const toggleButton = screen.getByRole('button', { name: '' }); // Eye icon button
      
      // Initially password should be hidden
      expect(passwordInput).toHaveAttribute('type', 'password');
      
      // Click to show password
      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');
      
      // Click to hide password again
      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Form Submission', () => {
    test('submits form with valid data', async () => {
      // Use fake timers to control setTimeout behavior
      jest.useFakeTimers();
      
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText('Email address');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);
      
      // Should show loading state immediately
      expect(screen.getByText('Signing in...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
      
      // Fast-forward the 1.5 second timeout and flush promises
      jest.advanceTimersByTime(1500);
      await Promise.resolve(); // Flush microtasks
      
      // Wait for the localStorage calls which indicate completion
      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith('isAuthenticated', 'true');
      });
      
      // Verify all localStorage calls
      expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify({
        email: 'test@example.com',
        name: 'test'
      }));
      
      // The form data should have been processed correctly
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(2);
      
      // Restore real timers
      jest.useRealTimers();
    });
  });

  describe('Keyboard Navigation', () => {
    test('submits form when Enter is pressed in email field', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText('Email address');
      const passwordInput = screen.getByLabelText('Password');
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      
      // Press Enter in email field using userEvent
      await user.type(emailInput, '{Enter}');
      
      await waitFor(() => {
        expect(screen.getByText('Signing in...')).toBeInTheDocument();
      });
    });

    test('submits form when Enter is pressed in password field', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText('Email address');
      const passwordInput = screen.getByLabelText('Password');
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      
      // Press Enter in password field using userEvent
      await user.type(passwordInput, '{Enter}');
      
      await waitFor(() => {
        expect(screen.getByText('Signing in...')).toBeInTheDocument();
      });
    });

    test('does not submit when other keys are pressed', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText('Email address');
      
      await user.type(emailInput, 'test@example.com{Tab}');
      
      // Should not show loading state
      expect(screen.queryByText('Signing in...')).not.toBeInTheDocument();
    });
  });

  describe('Form State Management', () => {
    test('updates form data when typing in inputs', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText('Email address');
      const passwordInput = screen.getByLabelText('Password');
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'mypassword');
      
      expect(emailInput).toHaveValue('test@example.com');
      expect(passwordInput).toHaveValue('mypassword');
    });

    test('handles checkbox interaction', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      const checkbox = screen.getByRole('checkbox', { name: /remember me/i });
      
      expect(checkbox).not.toBeChecked();
      
      await user.click(checkbox);
      expect(checkbox).toBeChecked();
    });
  });

  describe('Links and Navigation', () => {
    test('renders forgot password link with correct href', () => {
      render(<LoginPage />);
      
      const forgotPasswordLink = screen.getByText('Forgot your password?');
      expect(forgotPasswordLink).toHaveAttribute('href', '#');
    });

    test('renders sign up link with correct href', () => {
      render(<LoginPage />);
      
      const signUpLink = screen.getByText('Create a new account');
      expect(signUpLink).toHaveAttribute('href', '/signup');
    });
  });

  describe('Loading State', () => {
    test('shows loading state during submission', async () => {
      // Use fake timers to control setTimeout behavior
      jest.useFakeTimers();
      
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<LoginPage />);
      
      const emailInput = screen.getByLabelText('Email address');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      
      // Initially button should be enabled
      expect(submitButton).not.toBeDisabled();
      
      await user.click(submitButton);
      
      // During submission, button should be disabled with loading text
      expect(submitButton).toBeDisabled();
      expect(screen.getByText('Signing in...')).toBeInTheDocument();
      
      // Fast-forward the timeout and flush promises
      jest.advanceTimersByTime(1500);
      await Promise.resolve(); // Flush microtasks
      
      // Wait for the operation to complete (localStorage should be set)
      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith('isAuthenticated', 'true');
      });
      
      // Verify the login process completed
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(2);
      
      // Restore real timers
      jest.useRealTimers();
    });
  });

  describe('Error Display', () => {
    test('displays validation errors correctly', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      // Submit without filling fields
      await user.click(submitButton);
      
      // Should show validation errors
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
      
      // Error styling should be applied
      const emailInput = screen.getByLabelText('Email address');
      const passwordInput = screen.getByLabelText('Password');
      
      expect(emailInput).toHaveClass('border-red-300');
      expect(passwordInput).toHaveClass('border-red-300');
    });
  });
});