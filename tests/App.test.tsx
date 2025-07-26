import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../src/App';

test('App renders without crashing', () => {
  render(<App />);
  expect(true).toBe(true);
});
