import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthHeader from '../../../src/components/ui/AuthHeader';

describe('AuthHeader', () => {
  const defaultProps = {
    icon: '🔐',
    title: 'Welcome Back',
    subtitle: 'Sign in to your account'
  };

  describe('Rendering', () => {
    test('renders all elements with required props', () => {
      render(<AuthHeader {...defaultProps} />);
      
      expect(screen.getByText('🔐')).toBeInTheDocument();
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    });

    test('renders title as h2 heading', () => {
      render(<AuthHeader {...defaultProps} />);
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Welcome Back');
    });

    test('renders subtitle as paragraph', () => {
      render(<AuthHeader {...defaultProps} />);
      
      const subtitle = screen.getByText('Sign in to your account');
      expect(subtitle.tagName).toBe('P');
    });

    test('renders icon in circular container', () => {
      const { container } = render(<AuthHeader {...defaultProps} />);
      
      const iconContainer = container.querySelector('.w-16.h-16.rounded-full');
      expect(iconContainer).toBeInTheDocument();
      expect(iconContainer).toHaveTextContent('🔐');
    });
  });

  describe('Default Props', () => {
    test('applies default gradient classes', () => {
      const { container } = render(<AuthHeader {...defaultProps} />);
      
      const iconContainer = container.querySelector('.bg-gradient-to-br');
      expect(iconContainer).toHaveClass('from-indigo-500');
      expect(iconContainer).toHaveClass('to-purple-600');
    });

    test('applies all styling classes correctly', () => {
      const { container } = render(<AuthHeader {...defaultProps} />);
      
      // Root container classes
      const rootDiv = container.firstChild as HTMLElement;
      expect(rootDiv).toHaveClass('text-center', 'mb-8');
      
      // Icon container classes
      const iconContainer = container.querySelector('.w-16') as HTMLElement;
      expect(iconContainer).toHaveClass(
        'w-16',
        'h-16',
        'bg-gradient-to-br',
        'rounded-full',
        'mx-auto',
        'mb-4',
        'flex',
        'items-center',
        'justify-center',
        'text-white',
        'text-2xl'
      );
      
      // Title classes
      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toHaveClass('text-2xl', 'font-bold', 'text-gray-900', 'mb-2');
      
      // Subtitle classes
      const subtitle = screen.getByText(defaultProps.subtitle);
      expect(subtitle).toHaveClass('text-gray-600');
    });
  });

  describe('Custom Props', () => {
    test('applies custom gradientFrom prop', () => {
      const { container } = render(
        <AuthHeader {...defaultProps} gradientFrom="blue-500" />
      );
      
      const iconContainer = container.querySelector('.bg-gradient-to-br');
      expect(iconContainer).toHaveClass('from-blue-500');
      expect(iconContainer).toHaveClass('to-purple-600'); // Should keep default gradientTo
    });

    test('applies custom gradientTo prop', () => {
      const { container } = render(
        <AuthHeader {...defaultProps} gradientTo="red-500" />
      );
      
      const iconContainer = container.querySelector('.bg-gradient-to-br');
      expect(iconContainer).toHaveClass('from-indigo-500'); // Should keep default gradientFrom
      expect(iconContainer).toHaveClass('to-red-500');
    });

    test('applies both custom gradient props', () => {
      const { container } = render(
        <AuthHeader 
          {...defaultProps} 
          gradientFrom="green-400" 
          gradientTo="blue-800" 
        />
      );
      
      const iconContainer = container.querySelector('.bg-gradient-to-br');
      expect(iconContainer).toHaveClass('from-green-400');
      expect(iconContainer).toHaveClass('to-blue-800');
      expect(iconContainer).not.toHaveClass('from-indigo-500');
      expect(iconContainer).not.toHaveClass('to-purple-600');
    });

    test('renders different content props', () => {
      render(
        <AuthHeader 
          icon="🚀" 
          title="Get Started" 
          subtitle="Create your new account today" 
        />
      );
      
      expect(screen.getByText('🚀')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: 'Get Started' })).toBeInTheDocument();
      expect(screen.getByText('Create your new account today')).toBeInTheDocument();
    });
  });

  describe('Gradient Combinations', () => {
    test('works with various Tailwind color combinations', () => {
      const gradientCombinations = [
        { from: 'red-500', to: 'pink-500' },
        { from: 'yellow-400', to: 'orange-500' },
        { from: 'emerald-400', to: 'cyan-400' },
        { from: 'violet-600', to: 'purple-600' },
        { from: 'slate-600', to: 'gray-800' },
      ];

      gradientCombinations.forEach(({ from, to }) => {
        const { container, unmount } = render(
          <AuthHeader 
            {...defaultProps} 
            gradientFrom={from} 
            gradientTo={to} 
          />
        );
        
        const iconContainer = container.querySelector('.bg-gradient-to-br');
        expect(iconContainer).toHaveClass(`from-${from}`);
        expect(iconContainer).toHaveClass(`to-${to}`);
        
        // Clean up for next iteration
        unmount();
      });
    });
  });

  describe('DOM Structure', () => {
    test('has correct DOM hierarchy', () => {
      const { container } = render(<AuthHeader {...defaultProps} />);
      
      // Root container
      const rootDiv = container.firstChild as HTMLElement;
      expect(rootDiv.tagName).toBe('DIV');
      expect(rootDiv).toHaveClass('text-center', 'mb-8');
      
      // Icon container should be first child
      const iconContainer = rootDiv.querySelector('.w-16') as HTMLElement;
      expect(iconContainer.tagName).toBe('DIV');
      expect(iconContainer.parentElement).toBe(rootDiv);
      
      // Title should be second child
      const title = rootDiv.querySelector('h2') as HTMLElement;
      expect(title.parentElement).toBe(rootDiv);
      
      // Subtitle should be third child
      const subtitle = rootDiv.querySelector('p') as HTMLElement;
      expect(subtitle.parentElement).toBe(rootDiv);
    });

    test('maintains proper element order', () => {
      const { container } = render(<AuthHeader {...defaultProps} />);
      
      const rootDiv = container.firstChild as HTMLElement;
      const children = Array.from(rootDiv.children);
      
      // Should be in order: icon container, h2, p
      expect(children).toHaveLength(3);
      expect(children[0]).toHaveClass('w-16'); // Icon container
      expect(children[1].tagName).toBe('H2'); // Title
      expect(children[2].tagName).toBe('P'); // Subtitle
    });
  });

  describe('Accessibility', () => {
    test('provides proper heading hierarchy', () => {
      render(<AuthHeader {...defaultProps} />);
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent(defaultProps.title);
    });

    test('maintains readable text contrast', () => {
      render(<AuthHeader {...defaultProps} />);
      
      // Title should have high contrast
      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toHaveClass('text-gray-900');
      
      // Subtitle should have medium contrast but still readable
      const subtitle = screen.getByText(defaultProps.subtitle);
      expect(subtitle).toHaveClass('text-gray-600');
    });

    test('ensures icon is accessible', () => {
      render(<AuthHeader {...defaultProps} />);
      
      const iconText = screen.getByText('🔐');
      expect(iconText).toBeInTheDocument();
      
      // Icon should be visible and not hidden from screen readers
      const iconContainer = iconText.parentElement;
      expect(iconContainer).not.toHaveAttribute('aria-hidden');
    });
  });

  describe('Edge Cases', () => {
    test('handles empty icon string', () => {
      const { container } = render(<AuthHeader {...defaultProps} icon="" />);
      
      const iconContainer = container.querySelector('.w-16');
      expect(iconContainer).toBeInTheDocument();
      expect(iconContainer).toHaveTextContent('');
    });

    test('handles special characters in props', () => {
      const specialProps = {
        icon: '🔐🚀',
        title: 'Welcome & Hello!',
        subtitle: 'Sign in to your account (required)'
      };
      
      render(<AuthHeader {...specialProps} />);
      
      expect(screen.getByText('🔐🚀')).toBeInTheDocument();
      expect(screen.getByText('Welcome & Hello!')).toBeInTheDocument();
      expect(screen.getByText('Sign in to your account (required)')).toBeInTheDocument();
    });

    test('handles very long text content', () => {
      const longProps = {
        icon: '📱',
        title: 'This is a very long title that might need to wrap',
        subtitle: 'This is a very long subtitle with lots of explanatory text'
      };
      
      render(<AuthHeader {...longProps} />);
      
      expect(screen.getByText(longProps.title)).toBeInTheDocument();
      expect(screen.getByText(longProps.subtitle)).toBeInTheDocument();
    });

    test('handles numeric and symbol content', () => {
      render(<AuthHeader icon="42" title="2FA Code" subtitle="Step 2 of 3" />);
      
      expect(screen.getByText('42')).toBeInTheDocument();
      expect(screen.getByText('2FA Code')).toBeInTheDocument();
      expect(screen.getByText('Step 2 of 3')).toBeInTheDocument();
    });
  });

  describe('TypeScript Props Validation', () => {
    test('accepts all required props', () => {
      expect(() => {
        render(
          <AuthHeader 
            icon="test" 
            title="test title" 
            subtitle="test subtitle" 
          />
        );
      }).not.toThrow();
    });

    test('accepts optional gradient props', () => {
      expect(() => {
        render(
          <AuthHeader 
            icon="test" 
            title="test title" 
            subtitle="test subtitle"
            gradientFrom="blue-500"
            gradientTo="green-500"
          />
        );
      }).not.toThrow();
    });
  });
});