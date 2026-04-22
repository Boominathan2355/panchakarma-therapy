import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import LoginForm from './LoginForm';
import { AuthProvider } from '../context/AuthContext';

// We can mock the context or just wrap it in AuthProvider.
// For testing specific states like isLoading, we might need to mock useAuth.

vi.mock('../index', () => ({
  useAuth: vi.fn(() => ({
    login: vi.fn(),
    isLoading: false,
    isError: false,
    message: '',
    user: null,
    reset: vi.fn(),
  })),
}));

import { useAuth } from '../index';

const renderWithProviders = () => {
  return render(
    <BrowserRouter>
      <LoginForm />
    </BrowserRouter>
  );
};

describe('LoginForm', () => {
  it('renders correctly', () => {
    renderWithProviders();
    expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    renderWithProviders();
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    expect(await screen.findByText(/Username is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Password is required/i)).toBeInTheDocument();
  });

  it('shows loading state when isLoading is true', () => {
    vi.mocked(useAuth).mockReturnValue({
      login: vi.fn(),
      isLoading: true,
      isError: false,
      message: '',
      user: null,
      reset: vi.fn(),
    } as any);

    renderWithProviders();
    expect(screen.getByText(/Signing In.../i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows error banner when isError is true', () => {
    const errorMessage = 'Invalid credentials';
    vi.mocked(useAuth).mockReturnValue({
      login: vi.fn(),
      isLoading: false,
      isError: true,
      message: errorMessage,
      user: null,
      reset: vi.fn(),
    } as any);

    renderWithProviders();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
