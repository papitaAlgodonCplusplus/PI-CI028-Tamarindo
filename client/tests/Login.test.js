import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthContext } from '../src/AuthContext.js';
import '@testing-library/jest-dom'
import Login from '../src/pages/Login.jsx';
import axios from 'axios';

jest.mock('axios');
const login = jest.fn();
const logout = jest.fn();

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));


test('renders the login form', async () => {
  render(
    <AuthContext.Provider value={{ login, logout }}>
      <Login />
    </AuthContext.Provider>
  );

  expect(screen.getByText('Email address')).toBeInTheDocument();
  expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
  expect(screen.getByText('Password')).toBeInTheDocument();
});

test('handles form submission', async () => {
  render(
    <AuthContext.Provider value={{ login, logout }}>
      <Login />
    </AuthContext.Provider>
  );

  const emailInput = screen.getByPlaceholderText('Email');
  const passwordInput = screen.getByPlaceholderText('Password');
  const submitButton = screen.getByRole('button', { name: 'Log In', type: 'submit' });

  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'testpassword' } });

  await waitFor(() => expect(submitButton).toBeEnabled());

  fireEvent.click(submitButton);

  expect(axios.post).toHaveBeenCalledTimes(1);
  expect(axios.post).toHaveBeenCalledWith('/auth/login', { email: 'test@example.com', password: 'testpassword' });
});

test('displays error messages', async () => {
  render(
    <AuthContext.Provider value={{ login, logout }}>
      <Login />
    </AuthContext.Provider>
  );

  const emailInput = screen.getByPlaceholderText('Email');
  const passwordInput = screen.getByPlaceholderText('Password');
  const submitButton = screen.getByRole('button', { name: 'Log In', type: 'submit' });


  fireEvent.change(emailInput, { target: { value: '' } });
  fireEvent.change(passwordInput, { target: { value: '' } });

  await waitFor(() => expect(screen.getByText('Please provide an email')).toBeEnabled());
  await waitFor(() => expect(screen.getByText('Please provide a password')).toBeEnabled());

  fireEvent.click(submitButton);
});

test('handles login success', async () => {
  render(
    <AuthContext.Provider value={{ login, logout }}>
      <Login />
    </AuthContext.Provider>
  );

  const emailInput = screen.getByPlaceholderText('Email');
  const passwordInput = screen.getByPlaceholderText('Password');
  const submitButton = screen.getByRole('button', { name: 'Log In', type: 'submit' });

  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'testpassword' } });

  await waitFor(() => expect(submitButton).toBeEnabled());

  fireEvent.click(submitButton);

  expect(axios.post).toHaveBeenCalledTimes(2);
  expect(axios.post).toHaveBeenCalledWith('/auth/login', { email: 'test@example.com', password: 'testpassword' });
});