import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthContainer from '../../../src/components/ui/AuthContainer';

describe('AuthContainer', () => {
  describe('Rendering', () => {
    test('renders children correctly', () => {
      const testContent = 'Test content inside container';
      
      render(
        <AuthContainer>
          <div>{testContent}</div>
        </AuthContainer>
      );
      
      expect(screen.getByText(testContent)).toBeInTheDocument();
    });

    test('renders complex children correctly', () => {
      const ComplexChild = () => (
        <div>
          <h1>Complex Component</h1>
          <p>With multiple elements</p>
          <button>Action Button</button>
        </div>
      );
      
      render(
        <AuthContainer>
          <ComplexChild />
        </AuthContainer>
      );
      
      expect(screen.getByText('Complex Component')).toBeInTheDocument();
      expect(screen.getByText('With multiple elements')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument();
    });

    test('renders multiple children correctly', () => {
      render(
        <AuthContainer>
          <h1>Title</h1>
          <p>Description</p>
          <button>Submit</button>
        </AuthContainer>
      );
      
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });
  });

  describe('Default Props', () => {
    test('applies default gradient classes when no props provided', () => {
      const { container } = render(
        <AuthContainer>
          <div>Test</div>
        </AuthContainer>
      );
      
      const outerDiv = container.firstChild as HTMLElement;
      expect(outerDiv).toHaveClass('bg-gradient-to-br');
      expect(outerDiv).toHaveClass('from-indigo-500');
      expect(outerDiv).toHaveClass('to-purple-600');
    });

    test('applies core layout classes with defaults', () => {
      const { container } = render(
        <AuthContainer>
          <div>Test</div>
        </AuthContainer>
      );
      
      const outerDiv = container.firstChild as HTMLElement;
      expect(outerDiv).toHaveClass(
        'min-h-screen',
        'bg-gradient-to-br', 
        'flex',
        'items-center',
        'justify-center',
        'p-5'
      );
    });

    test('applies inner container classes correctly', () => {
      const { container } = render(
        <AuthContainer>
          <div>Test</div>
        </AuthContainer>
      );
      
      const outerDiv = container.firstChild as HTMLElement;
      const innerDiv = outerDiv.querySelector('div:last-child') as HTMLElement;
      
      expect(innerDiv).toHaveClass(
        'bg-white',
        'rounded-2xl',
        'shadow-2xl',
        'max-w-md',
        'w-full',
        'p-8'
      );
    });
  });

  describe('Custom Props', () => {
    test('applies custom gradientFrom prop', () => {
      const { container } = render(
        <AuthContainer gradientFrom="blue-500">
          <div>Test</div>
        </AuthContainer>
      );
      
      const outerDiv = container.firstChild as HTMLElement;
      expect(outerDiv).toHaveClass('from-blue-500');
      expect(outerDiv).toHaveClass('to-purple-600'); // Should still use default gradientTo
    });

    test('applies custom gradientTo prop', () => {
      const { container } = render(
        <AuthContainer gradientTo="red-500">
          <div>Test</div>
        </AuthContainer>
      );
      
      const outerDiv = container.firstChild as HTMLElement;
      expect(outerDiv).toHaveClass('from-indigo-500'); // Should still use default gradientFrom
      expect(outerDiv).toHaveClass('to-red-500');
    });

    test('applies both custom gradient props', () => {
      const { container } = render(
        <AuthContainer gradientFrom="green-400" gradientTo="blue-800">
          <div>Test</div>
        </AuthContainer>
      );
      
      const outerDiv = container.firstChild as HTMLElement;
      expect(outerDiv).toHaveClass('from-green-400');
      expect(outerDiv).toHaveClass('to-blue-800');
      expect(outerDiv).not.toHaveClass('from-indigo-500');
      expect(outerDiv).not.toHaveClass('to-purple-600');
    });

    test('handles various Tailwind gradient color options', () => {
      const gradientOptions = [
        { from: 'red-500', to: 'pink-500' },
        { from: 'yellow-400', to: 'orange-500' },
        { from: 'emerald-400', to: 'cyan-400' },
        { from: 'violet-600', to: 'purple-600' },
      ];

      gradientOptions.forEach(({ from, to }) => {
        const { container } = render(
          <AuthContainer gradientFrom={from} gradientTo={to}>
            <div>Test {from} {to}</div>
          </AuthContainer>
        );
        
        const outerDiv = container.firstChild as HTMLElement;
        expect(outerDiv).toHaveClass(`from-${from}`);
        expect(outerDiv).toHaveClass(`to-${to}`);
      });
    });
  });

  describe('Structure and Layout', () => {
    test('has correct DOM structure', () => {
      const { container } = render(
        <AuthContainer>
          <div data-testid="child-content">Test content</div>
        </AuthContainer>
      );
      
      // Should have outer div with gradient
      const outerDiv = container.firstChild as HTMLElement;
      expect(outerDiv.tagName).toBe('DIV');
      
      // Should have inner white container
      const innerDiv = outerDiv.querySelector('.bg-white');
      expect(innerDiv).toBeInTheDocument();
      expect(innerDiv?.tagName).toBe('DIV');
      
      // Should contain the child content
      const childContent = screen.getByTestId('child-content');
      expect(innerDiv).toContainElement(childContent);
    });

    test('creates full-height container', () => {
      const { container } = render(
        <AuthContainer>
          <div>Test</div>
        </AuthContainer>
      );
      
      const outerDiv = container.firstChild as HTMLElement;
      expect(outerDiv).toHaveClass('min-h-screen');
    });

    test('centers content horizontally and vertically', () => {
      const { container } = render(
        <AuthContainer>
          <div>Test</div>
        </AuthContainer>
      );
      
      const outerDiv = container.firstChild as HTMLElement;
      expect(outerDiv).toHaveClass('flex', 'items-center', 'justify-center');
    });

    test('applies responsive width constraints', () => {
      const { container } = render(
        <AuthContainer>
          <div>Test</div>
        </AuthContainer>
      );
      
      const outerDiv = container.firstChild as HTMLElement;
      const innerDiv = outerDiv.querySelector('.bg-white') as HTMLElement;
      
      expect(innerDiv).toHaveClass('max-w-md', 'w-full');
    });
  });

  describe('Accessibility', () => {
    test('renders semantic HTML structure', () => {
      const { container } = render(
        <AuthContainer>
          <main>
            <h1>Login Form</h1>
            <form>
              <input type="email" aria-label="Email" />
              <button type="submit">Submit</button>
            </form>
          </main>
        </AuthContainer>
      );
      
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Login Form' })).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
      
      // Verify form element exists in DOM (even if role isn't accessible)
      const formElement = container.querySelector('form');
      expect(formElement).toBeInTheDocument();
    });

    test('preserves child accessibility attributes', () => {
      render(
        <AuthContainer>
          <button aria-label="Custom Button" aria-describedby="help-text">
            Click me
          </button>
          <div id="help-text">Help text for button</div>
        </AuthContainer>
      );
      
      const button = screen.getByRole('button', { name: 'Custom Button' });
      expect(button).toHaveAttribute('aria-describedby', 'help-text');
    });
  });

  describe('Edge Cases', () => {
    test('renders without children', () => {
      const { container } = render(<AuthContainer>{null}</AuthContainer>);
      
      const outerDiv = container.firstChild as HTMLElement;
      const innerDiv = outerDiv.querySelector('.bg-white') as HTMLElement;
      
      expect(outerDiv).toBeInTheDocument();
      expect(innerDiv).toBeInTheDocument();
      expect(innerDiv.textContent).toBe('');
    });

    test('renders with undefined children', () => {
      const { container } = render(<AuthContainer>{undefined}</AuthContainer>);
      
      expect(container.firstChild).toBeInTheDocument();
    });

    test('renders with empty string children', () => {
      render(<AuthContainer>{''}</AuthContainer>);
      
      // Container should still render even with empty content
      const container = document.querySelector('.bg-white');
      expect(container).toBeInTheDocument();
    });

    test('renders with boolean children (should not render)', () => {
      const { container } = render(<AuthContainer>{false}</AuthContainer>);
      
      const innerDiv = container.querySelector('.bg-white') as HTMLElement;
      expect(innerDiv).toBeInTheDocument();
      expect(innerDiv.textContent).toBe('');
    });
  });

  describe('TypeScript Props', () => {
    test('accepts valid gradient color values', () => {
      // This test ensures the component accepts string props correctly
      const validGradients = [
        'slate-500',
        'zinc-700', 
        'stone-400',
        'red-600',
        'orange-500',
        'amber-400',
        'yellow-300',
        'lime-500',
        'green-600',
        'emerald-500',
        'teal-500',
        'cyan-500',
        'sky-500',
        'blue-600',
        'indigo-600',
        'violet-600',
        'purple-600',
        'fuchsia-600',
        'pink-500',
        'rose-500'
      ];

      validGradients.forEach(color => {
        expect(() => {
          render(
            <AuthContainer gradientFrom={color} gradientTo={color}>
              <div>Test</div>
            </AuthContainer>
          );
        }).not.toThrow();
      });
    });
  });

  describe('CSS Class Generation', () => {
    test('generates correct CSS class strings', () => {
      const testCases = [
        { from: 'blue-500', to: 'green-500', expectedFrom: 'from-blue-500', expectedTo: 'to-green-500' },
        { from: 'red-300', to: 'pink-700', expectedFrom: 'from-red-300', expectedTo: 'to-pink-700' },
        { from: 'gray-100', to: 'gray-900', expectedFrom: 'from-gray-100', expectedTo: 'to-gray-900' },
      ];

      testCases.forEach(({ from, to, expectedFrom, expectedTo }) => {
        const { container } = render(
          <AuthContainer gradientFrom={from} gradientTo={to}>
            <div data-testid="test-content">Content</div>
          </AuthContainer>
        );
        
        const outerDiv = container.firstChild as HTMLElement;
        expect(outerDiv).toHaveClass(expectedFrom);
        expect(outerDiv).toHaveClass(expectedTo);
      });
    });
  });
});