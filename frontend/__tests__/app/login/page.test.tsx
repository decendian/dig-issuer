import React from 'react';
import { render } from '@testing-library/react';
import Login from '../../../src/app/login/page';

describe('Login', () => {
  it('renders without crashing', () => {
    expect(() => render(<Login />)).not.toThrow();
  });

  it('returns a valid React element', () => {
    const result = Login();
    expect(React.isValidElement(result)).toBe(true);
  });

  it('is a function component', () => {
    expect(typeof Login).toBe('function');
    expect(Login.name).toBe('Login');
  });

  it('renders some content', () => {
    const { container } = render(<Login />);
    expect(container.firstChild).not.toBeNull();
    expect(container.firstChild).toBeInTheDocument();
  });
});