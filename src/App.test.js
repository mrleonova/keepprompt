import { render, screen } from '@testing-library/react';
import App from './App';

test('renders KeepPrompt application', () => {
  render(<App />);
  const logoElement = screen.getByRole('heading', { name: /KeepPrompt/i });
  expect(logoElement).toBeInTheDocument();
});

test('renders search input', () => {
  render(<App />);
  const searchElement = screen.getByPlaceholderText(/Search prompts/i);
  expect(searchElement).toBeInTheDocument();
});

test('renders new prompt button', () => {
  render(<App />);
  const newButtonElement = screen.getByRole('button', { name: /New/i });
  expect(newButtonElement).toBeInTheDocument();
});
