import React from 'react';
import { render, screen } from '@testing-library/react';
// import App from './App';
import app from './App';

test('renders learn react link', () => {
  // render(<App />);
  render(app);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
