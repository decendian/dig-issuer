import React from 'react';
import { render } from '@testing-library/react';
import Signup from '../../../src/app/signup/page';

describe('Signup', () => {
  it('renders without crashing', () => {
    expect(() => render(<Signup />)).not.toThrow();
  });

  it('returns a valid React element', () => {
    const result = Signup();
    expect(React.isValidElement(result)).toBe(true);
  });

  it('is a function component', () => {
    expect(typeof Signup).toBe('function');
    expect(Signup.name).toBe('Signup');
  });

  it('renders some content', () => {
    const { container } = render(<Signup />);
    expect(container.firstChild).not.toBeNull();
    expect(container.firstChild).toBeInTheDocument();
  });
});