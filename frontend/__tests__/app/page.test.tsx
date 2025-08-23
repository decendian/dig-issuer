import React from 'react';
import { render, screen } from '@testing-library/react';
import Link from 'next/link';
import Home from '../../src/app/page';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return jest.fn(({ children, href, className, ...props }) => {
    return (
      <a href={href} className={className} {...props}>
        {children}
      </a>
    );
  });
});

describe('Home', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the home page with welcome message', () => {
      render(<Home />);
      
      expect(screen.getByRole('heading', { name: 'Welcome to Issuer' })).toBeInTheDocument();
      expect(screen.getByText('Welcome to Issuer')).toBeInTheDocument();
    });

    it('renders login link', () => {
      render(<Home />);
      
      const loginLink = screen.getByRole('link', { name: 'Login' });
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute('href', '/login');
    });

    it('renders signup link', () => {
      render(<Home />);
      
      const signupLink = screen.getByRole('link', { name: 'Sign Up' });
      expect(signupLink).toBeInTheDocument();
      expect(signupLink).toHaveAttribute('href', '/signup');
    });

    it('renders both navigation links', () => {
      render(<Home />);
      
      expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Sign Up' })).toBeInTheDocument();
    });
  });

  describe('Link components', () => {
    it('uses Next.js Link for login navigation', () => {
      render(<Home />);
      
      expect(Link).toHaveBeenNthCalledWith(
        1, // Check the first call
        expect.objectContaining({
          href: '/login',
          children: 'Login'
        }),
        undefined
      );
    });

    it('uses Next.js Link for signup navigation', () => {
      render(<Home />);
      
      expect(Link).toHaveBeenNthCalledWith(
        2, // Check the second call
        expect.objectContaining({
          href: '/signup',
          children: 'Sign Up'
        }),
        undefined
      );
    });

    it('calls Link component exactly twice', () => {
      render(<Home />);
      
      expect(Link).toHaveBeenCalledTimes(2);
    });
  });

  describe('Styling and CSS classes', () => {
    it('applies correct container classes', () => {
      const { container } = render(<Home />);
      
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass(
        'min-h-screen',
        'bg-gradient-to-br',
        'from-purple-50',
        'to-blue-100',
        'flex',
        'items-center',
        'justify-center'
      );
    });

    it('applies correct text center class to content wrapper', () => {
      render(<Home />);
      
      const heading = screen.getByRole('heading', { name: 'Welcome to Issuer' });
      const textCenterContainer = heading.closest('.text-center');
      expect(textCenterContainer).toBeInTheDocument();
    });

    it('applies correct heading styles', () => {
      render(<Home />);
      
      const heading = screen.getByRole('heading', { name: 'Welcome to Issuer' });
      expect(heading).toHaveClass(
        'text-4xl',
        'font-bold',
        'text-gray-900',
        'mb-8'
      );
    });

    it('applies correct login link styles', () => {
      render(<Home />);
      
      const loginLink = screen.getByRole('link', { name: 'Login' });
      expect(loginLink).toHaveClass(
        'bg-indigo-600',
        'text-white',
        'px-6',
        'py-3',
        'rounded-lg',
        'hover:bg-indigo-700',
        'inline-block'
      );
    });

    it('applies correct signup link styles', () => {
      render(<Home />);
      
      const signupLink = screen.getByRole('link', { name: 'Sign Up' });
      expect(signupLink).toHaveClass(
        'bg-white',
        'text-indigo-600',
        'px-6',
        'py-3',
        'rounded-lg',
        'border',
        'border-indigo-600',
        'hover:bg-indigo-50',
        'inline-block'
      );
    });

    it('applies space-x-4 class to links container', () => {
      render(<Home />);
      
      const loginLink = screen.getByRole('link', { name: 'Login' });
      const linksContainer = loginLink.parentElement;
      expect(linksContainer).toHaveClass('space-x-4');
    });
  });

  describe('Component structure', () => {
    it('has correct DOM hierarchy', () => {
      const { container } = render(<Home />);
      
      // Main container
      const mainDiv = container.firstChild;
      expect(mainDiv.tagName).toBe('DIV');
      
      // Text center container
      const textCenterDiv = mainDiv.firstChild;
      expect(textCenterDiv).toHaveClass('text-center');
      
      // Heading
      const heading = textCenterDiv.firstChild;
      expect(heading.tagName).toBe('H1');
      
      // Links container
      const linksContainer = textCenterDiv.lastChild;
      expect(linksContainer).toHaveClass('space-x-4');
    });

    it('contains exactly one heading', () => {
      render(<Home />);
      
      const headings = screen.getAllByRole('heading');
      expect(headings).toHaveLength(1);
      expect(headings[0]).toHaveTextContent('Welcome to Issuer');
    });

    it('contains exactly two links', () => {
      render(<Home />);
      
      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(2);
      
      const linkTexts = links.map(link => link.textContent);
      expect(linkTexts).toEqual(['Login', 'Sign Up']);
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<Home />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Welcome to Issuer');
    });

    it('has accessible link text', () => {
      render(<Home />);
      
      const loginLink = screen.getByRole('link', { name: 'Login' });
      const signupLink = screen.getByRole('link', { name: 'Sign Up' });
      
      expect(loginLink).toHaveAccessibleName('Login');
      expect(signupLink).toHaveAccessibleName('Sign Up');
    });

    it('links have proper href attributes for screen readers', () => {
      render(<Home />);
      
      const loginLink = screen.getByRole('link', { name: 'Login' });
      const signupLink = screen.getByRole('link', { name: 'Sign Up' });
      
      expect(loginLink).toHaveAttribute('href', '/login');
      expect(signupLink).toHaveAttribute('href', '/signup');
    });
  });

  describe('Component behavior', () => {
    it('renders consistently across multiple renders', () => {
      const { rerender } = render(<Home />);
      
      expect(screen.getByText('Welcome to Issuer')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Sign Up' })).toBeInTheDocument();
      
      rerender(<Home />);
      
      expect(screen.getByText('Welcome to Issuer')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Sign Up' })).toBeInTheDocument();
    });

    it('does not have side effects', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const errorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      render(<Home />);
      
      expect(consoleSpy).not.toHaveBeenCalled();
      expect(errorSpy).not.toHaveBeenCalled();
      
      consoleSpy.mockRestore();
      errorSpy.mockRestore();
    });

    it('is a functional component without state', () => {
      // Test that component renders the same output consistently
      const { container: container1 } = render(<Home />);
      const { container: container2 } = render(<Home />);
      
      expect(container1.innerHTML).toBe(container2.innerHTML);
    });
  });

  describe('Default export', () => {
    it('exports Home as default export', () => {
      expect(typeof Home).toBe('function');
      expect(Home.name).toBe('Home');
    });

    it('returns valid React element', () => {
      const result = Home();
      expect(React.isValidElement(result)).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('renders component structure correctly', () => {
      const { container } = render(<Home />);
      
      // Test that the component renders its essential elements
      expect(container).toBeInTheDocument();
      expect(Link).toHaveBeenCalledTimes(2); // Ensures both links render
    });

    it('handles component unmounting without errors', () => {
      const { unmount } = render(<Home />);
      
      expect(() => unmount()).not.toThrow();
    });

    it('handles multiple instances rendered simultaneously', () => {
      render(<Home />);
      render(<Home />);
      render(<Home />);
      
      // Should not cause any issues
      expect(screen.getAllByText('Welcome to Issuer')).toHaveLength(3);
      expect(screen.getAllByRole('link', { name: 'Login' })).toHaveLength(3);
      expect(screen.getAllByRole('link', { name: 'Sign Up' })).toHaveLength(3);
    });
  });
});