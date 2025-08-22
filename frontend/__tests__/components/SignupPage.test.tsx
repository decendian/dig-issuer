import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SignupPage from '../../src/components/SignupPage';

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

describe('SignupPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    mockConsoleLog.mockClear();
    mockConsoleError.mockClear();
  });

  describe('Rendering', () => {
    test('renders signup form with all elements', () => {
      render(<SignupPage />);
      
      expect(screen.getByText('Create your account')).toBeInTheDocument();
      expect(screen.getByText('Join us today and get started')).toBeInTheDocument();
      expect(screen.getByLabelText('First name')).toBeInTheDocument();
      expect(screen.getByLabelText('Last name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email address')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByLabelText('Confirm password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
      expect(screen.getByText('Terms and Conditions')).toBeInTheDocument();
      expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
      expect(screen.getByText('Sign in here')).toBeInTheDocument();
    });

    test('renders with correct placeholders', () => {
      render(<SignupPage />);
      
      expect(screen.getByPlaceholderText('First name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Last name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Create a password')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Confirm your password')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    test('shows error when first name is empty', async () => {
      const user = userEvent.setup();
      render(<SignupPage />);
      
      const submitButton = screen.getByRole('button', { name: /create account/i });
      await user.click(submitButton);
      
      expect(screen.getByText('First name is required')).toBeInTheDocument();
    });

    test('shows error when last name is empty', async () => {
      const user = userEvent.setup();
      render(<SignupPage />);
      
      const submitButton = screen.getByRole('button', { name: /create account/i });
      await user.click(submitButton);
      
      expect(screen.getByText('Last name is required')).toBeInTheDocument();
    });

    test('shows error when email is empty', async () => {
      const user = userEvent.setup();
      render(<SignupPage />);
      
      const submitButton = screen.getByRole('button', { name: /create account/i });
      await user.click(submitButton);
      
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    test('shows error when email format is invalid', async () => {
      const user = userEvent.setup();
      render(<SignupPage />);
      
      const emailInput = screen.getByLabelText('Email address');
      const submitButton = screen.getByRole('button', { name: /create account/i });
      
      await user.type(emailInput, 'invalid-email');
      await user.click(submitButton);
      
      expect(screen.getByText('Email is invalid')).toBeInTheDocument();
    });

    test('shows error when password is empty', async () => {
      const user = userEvent.setup();
      render(<SignupPage />);
      
      const submitButton = screen.getByRole('button', { name: /create account/i });
      await user.click(submitButton);
      
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });

    test('shows error when password is too short', async () => {
      const user = userEvent.setup();
      render(<SignupPage />);
      
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /create account/i });
      
      await user.type(passwordInput, '1234567'); // 7 characters
      await user.click(submitButton);
      
      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
    });

    test('shows error when password lacks complexity requirements', async () => {
      const user = userEvent.setup();
      render(<SignupPage />);
      
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /create account/i });
      
      await user.type(passwordInput, 'password123'); // no uppercase
      await user.click(submitButton);
      
      expect(screen.getByText('Password must contain at least one uppercase letter, one lowercase letter, and one number')).toBeInTheDocument();
    });

    test('shows error when confirm password is empty', async () => {
      const user = userEvent.setup();
      render(<SignupPage />);
      
      const submitButton = screen.getByRole('button', { name: /create account/i });
      await user.click(submitButton);
      
      expect(screen.getByText('Please confirm your password')).toBeInTheDocument();
    });

    test('shows error when passwords do not match', async () => {
      const user = userEvent.setup();
      render(<SignupPage />);
      
      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm password');
      const submitButton = screen.getByRole('button', { name: /create account/i });
      
      await user.type(passwordInput, 'Password123');
      await user.type(confirmPasswordInput, 'Password456');
      await user.click(submitButton);
      
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });

    test('clears errors when user starts typing', async () => {
      const user = userEvent.setup();
      render(<SignupPage />);
      
      const firstNameInput = screen.getByLabelText('First name');
      const submitButton = screen.getByRole('button', { name: /create account/i });
      
      // Trigger error
      await user.click(submitButton);
      expect(screen.getByText('First name is required')).toBeInTheDocument();
      
      // Start typing - error should clear
      await user.type(firstNameInput, 'J');
      expect(screen.queryByText('First name is required')).not.toBeInTheDocument();
    });
  });

  describe('Password Visibility Toggle', () => {
    test('toggles password visibility when eye icon is clicked', async () => {
      const user = userEvent.setup();
      render(<SignupPage />);
      
      const passwordInput = screen.getByLabelText('Password');
      const toggleButtons = screen.getAllByRole('button', { name: '' }); // Eye icon buttons
      const passwordToggleButton = toggleButtons[0]; // First toggle button for password
      
      // Initially password should be hidden
      expect(passwordInput).toHaveAttribute('type', 'password');
      
      // Click to show password
      await user.click(passwordToggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');
      
      // Click to hide password again
      await user.click(passwordToggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    test('toggles confirm password visibility when eye icon is clicked', async () => {
      const user = userEvent.setup();
      render(<SignupPage />);
      
      const confirmPasswordInput = screen.getByLabelText('Confirm password');
      const toggleButtons = screen.getAllByRole('button', { name: '' }); // Eye icon buttons
      const confirmPasswordToggleButton = toggleButtons[1]; // Second toggle button for confirm password
      
      // Initially confirm password should be hidden
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');
      
      // Click to show confirm password
      await user.click(confirmPasswordToggleButton);
      expect(confirmPasswordInput).toHaveAttribute('type', 'text');
      
      // Click to hide confirm password again
      await user.click(confirmPasswordToggleButton);
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Form Submission', () => {
    test('submits form with valid data', async () => {
      // Use fake timers to control setTimeout behavior
      jest.useFakeTimers();
      
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<SignupPage />);
      
      const firstNameInput = screen.getByLabelText('First name');
      const lastNameInput = screen.getByLabelText('Last name');
      const emailInput = screen.getByLabelText('Email address');
      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm password');
      const termsCheckbox = screen.getByRole('checkbox');
      const submitButton = screen.getByRole('button', { name: /create account/i });
      
      await user.type(firstNameInput, 'John');
      await user.type(lastNameInput, 'Doe');
      await user.type(emailInput, 'john.doe@example.com');
      await user.type(passwordInput, 'Password123');
      await user.type(confirmPasswordInput, 'Password123');
      await user.click(termsCheckbox);
      await user.click(submitButton);
      
      // Should show loading state immediately
      expect(screen.getByText('Creating account...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
      
      // Fast-forward the 2 second timeout and flush promises
      jest.advanceTimersByTime(2000);
      await Promise.resolve(); // Flush microtasks
      
      // Wait for the localStorage calls which indicate completion
      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith('isAuthenticated', 'true');
      });
      
      // Verify all localStorage calls
      expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify({
        email: 'john.doe@example.com',
        name: 'John Doe'
      }));
      
      // The form data should have been processed correctly
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(2);
      
      // Restore real timers
      jest.useRealTimers();
    });

    test('accepts valid password with complexity requirements', async () => {
      const user = userEvent.setup();
      render(<SignupPage />);
      
      const firstNameInput = screen.getByLabelText('First name');
      const lastNameInput = screen.getByLabelText('Last name');
      const emailInput = screen.getByLabelText('Email address');
      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm password');
      const termsCheckbox = screen.getByRole('checkbox');
      const submitButton = screen.getByRole('button', { name: /create account/i });
      
      await user.type(firstNameInput, 'John');
      await user.type(lastNameInput, 'Doe');
      await user.type(emailInput, 'john.doe@example.com');
      await user.type(passwordInput, 'MySecure123'); // Valid complex password
      await user.type(confirmPasswordInput, 'MySecure123');
      await user.click(termsCheckbox);
      await user.click(submitButton);
      
      // Should show loading state (indicates validation passed)
      expect(screen.getByText('Creating account...')).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    test('submits form when Enter is pressed in any field', async () => {
      const user = userEvent.setup();
      render(<SignupPage />);
      
      const firstNameInput = screen.getByLabelText('First name');
      const lastNameInput = screen.getByLabelText('Last name');
      const emailInput = screen.getByLabelText('Email address');
      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm password');
      const termsCheckbox = screen.getByRole('checkbox');
      
      await user.type(firstNameInput, 'John');
      await user.type(lastNameInput, 'Doe');
      await user.type(emailInput, 'john.doe@example.com');
      await user.type(passwordInput, 'Password123');
      await user.type(confirmPasswordInput, 'Password123');
      await user.click(termsCheckbox);
      
      // Press Enter in email field
      await user.type(emailInput, '{Enter}');
      
      await waitFor(() => {
        expect(screen.getByText('Creating account...')).toBeInTheDocument();
      });
    });
  });

  describe('Form State Management', () => {
    test('updates form data when typing in inputs', async () => {
      const user = userEvent.setup();
      render(<SignupPage />);
      
      const firstNameInput = screen.getByLabelText('First name');
      const lastNameInput = screen.getByLabelText('Last name');
      const emailInput = screen.getByLabelText('Email address');
      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm password');
      
      await user.type(firstNameInput, 'John');
      await user.type(lastNameInput, 'Doe');
      await user.type(emailInput, 'john.doe@example.com');
      await user.type(passwordInput, 'Password123');
      await user.type(confirmPasswordInput, 'Password123');
      
      expect(firstNameInput).toHaveValue('John');
      expect(lastNameInput).toHaveValue('Doe');
      expect(emailInput).toHaveValue('john.doe@example.com');
      expect(passwordInput).toHaveValue('Password123');
      expect(confirmPasswordInput).toHaveValue('Password123');
    });

    test('handles checkbox interaction', async () => {
      const user = userEvent.setup();
      render(<SignupPage />);
      
      const checkbox = screen.getByRole('checkbox');
      
      expect(checkbox).not.toBeChecked();
      
      await user.click(checkbox);
      expect(checkbox).toBeChecked();
    });
  });

  describe('Links and Navigation', () => {
    test('renders terms and conditions links', () => {
      render(<SignupPage />);
      
      const termsLink = screen.getByText('Terms and Conditions');
      const privacyLink = screen.getByText('Privacy Policy');
      
      expect(termsLink).toHaveAttribute('href', '#');
      expect(privacyLink).toHaveAttribute('href', '#');
    });

    test('renders sign in link with correct href', () => {
      render(<SignupPage />);
      
      const signInLink = screen.getByText('Sign in here');
      expect(signInLink).toHaveAttribute('href', '/login');
    });
  });

  describe('Loading State', () => {
    test('shows loading state during submission', async () => {
      // Use fake timers to control setTimeout behavior
      jest.useFakeTimers();
      
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<SignupPage />);
      
      const firstNameInput = screen.getByLabelText('First name');
      const lastNameInput = screen.getByLabelText('Last name');
      const emailInput = screen.getByLabelText('Email address');
      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm password');
      const termsCheckbox = screen.getByRole('checkbox');
      const submitButton = screen.getByRole('button', { name: /create account/i });
      
      await user.type(firstNameInput, 'John');
      await user.type(lastNameInput, 'Doe');
      await user.type(emailInput, 'john.doe@example.com');
      await user.type(passwordInput, 'Password123');
      await user.type(confirmPasswordInput, 'Password123');
      await user.click(termsCheckbox);
      
      // Initially button should be enabled
      expect(submitButton).not.toBeDisabled();
      
      await user.click(submitButton);
      
      // During submission, button should be disabled with loading text
      expect(submitButton).toBeDisabled();
      expect(screen.getByText('Creating account...')).toBeInTheDocument();
      
      // Fast-forward the timeout and flush promises
      jest.advanceTimersByTime(2000);
      await Promise.resolve(); // Flush microtasks
      
      // Wait for the operation to complete (localStorage should be set)
      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith('isAuthenticated', 'true');
      });
      
      // Verify the signup process completed
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(2);
      
      // Restore real timers
      jest.useRealTimers();
    });
  });

  describe('Error Display', () => {
    test('displays validation errors correctly', async () => {
      const user = userEvent.setup();
      render(<SignupPage />);
      
      const submitButton = screen.getByRole('button', { name: /create account/i });
      
      // Submit without filling fields
      await user.click(submitButton);
      
      // Should show validation errors
      expect(screen.getByText('First name is required')).toBeInTheDocument();
      expect(screen.getByText('Last name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
      expect(screen.getByText('Please confirm your password')).toBeInTheDocument();
      
      // Error styling should be applied
      const firstNameInput = screen.getByLabelText('First name');
      const lastNameInput = screen.getByLabelText('Last name');
      const emailInput = screen.getByLabelText('Email address');
      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm password');
      
      expect(firstNameInput).toHaveClass('border-red-300');
      expect(lastNameInput).toHaveClass('border-red-300');
      expect(emailInput).toHaveClass('border-red-300');
      expect(passwordInput).toHaveClass('border-red-300');
      expect(confirmPasswordInput).toHaveClass('border-red-300');
    });

    test('shows specific password validation messages', async () => {
      const user = userEvent.setup();
      render(<SignupPage />);
      
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /create account/i });
      
      // Test different invalid passwords
      await user.type(passwordInput, 'short');
      await user.click(submitButton);
      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
      
      await user.clear(passwordInput);
      await user.type(passwordInput, 'nouppercase123');
      await user.click(submitButton);
      expect(screen.getByText('Password must contain at least one uppercase letter, one lowercase letter, and one number')).toBeInTheDocument();
    });
  });

  describe('Terms and Conditions', () => {
    test('form includes terms and conditions checkbox', () => {
      render(<SignupPage />);
      
      const checkbox = screen.getByRole('checkbox');
      const label = screen.getByText(/I agree to the/);
      
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveAttribute('required');
      expect(label).toBeInTheDocument();
    });
  });
});