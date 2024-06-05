import React, { useState as useStateMock } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import Register from '../src/pages/Register.jsx';
import axios from 'axios';
import { showErrorDialog } from '../src/Misc.js'
module.exports = 'test-file-stub';

const mockFile = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });
jest.mock('axios');

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const setState = jest.fn();
beforeEach(() => {
  useStateMock.mockImplementation((init) => [init, setState]);
});

jest.mock('../src/Misc.js', () => ({
  showErrorDialog: jest.fn(),
}));

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));

test('renders the register form', async () => {
  render(
    <Register />
  );

  expect(screen.getByText('Sign Up')).toBeInTheDocument();
});

test('handles form submission', async () => {
  render(
    <Register />
  );

  const fileInput = screen.getByPlaceholderText("na");
  const nameInput = screen.getByLabelText('Name');
  const lastNameInput = screen.getByLabelText('Last Name');
  const emailInput = screen.getByLabelText('Email address');
  const phoneInput = screen.getByLabelText('Phone Number');
  const passwordInput = screen.getByLabelText('Password');
  const confirmPasswordInput = screen.getByLabelText('Confirm Password');
  const submitButton = screen.getByRole('button', { name: 'Sign Up', type: 'submit' });
  const checkbox = screen.getByLabelText('Accept Terms and Conditions');

  fireEvent.change(fileInput, { target: { files: [mockFile] } });
  fireEvent.change(nameInput, { target: { value: 'Test Name' } });
  fireEvent.change(lastNameInput, { target: { value: 'Test Last Name' } });
  fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
  fireEvent.change(phoneInput, { target: { value: 88225884 } });
  fireEvent.change(passwordInput, { target: { value: 'Testpassword123' } });
  fireEvent.change(confirmPasswordInput, { target: { value: 'Testpassword123' } });
  fireEvent.click(checkbox);

  await waitFor(() => expect(submitButton).toBeEnabled());

  fireEvent.click(submitButton);

  expect(showErrorDialog).toHaveBeenCalledTimes(0);
});

test('displays error messages', async () => {
  render(
    <Register />
  );

  const fileInput = screen.getByPlaceholderText("na");
  const nameInput = screen.getByLabelText('Name');
  const lastNameInput = screen.getByLabelText('Last Name');
  const emailInput = screen.getByLabelText('Email address');
  const phoneInput = screen.getByLabelText('Phone Number');
  const passwordInput = screen.getByLabelText('Password');
  const confirmPasswordInput = screen.getByLabelText('Confirm Password');
  const submitButton = screen.getByRole('button', { name: 'Sign Up', type: 'submit' });

  fireEvent.change(fileInput, { target: { files: [] } });

  await waitFor(() => expect(screen.getByText('Please provide a user image')).toBeEnabled());

  fireEvent.change(nameInput, { target: { value: '' } });
  await waitFor(() => expect(screen.getByText('Please provide your name')).toBeEnabled());

  fireEvent.change(lastNameInput, { target: { value: '' } });
  await waitFor(() => expect(screen.getByText('Please provide your last name')).toBeEnabled());

  fireEvent.change(emailInput, { target: { value: '' } });
  await waitFor(() => expect(screen.getByText('Please provide your email address')).toBeEnabled());

  fireEvent.change(phoneInput, { target: { value: '' } });
  await waitFor(() => expect(screen.getByText('Please provide your phone number')).toBeEnabled());

  fireEvent.change(passwordInput, { target: { value: '' } });
  await waitFor(() => expect(screen.getByText('Please provide a password')).toBeEnabled());

  fireEvent.change(confirmPasswordInput, { target: { value: '' } });
  await waitFor(() => expect(screen.getByText('Please confirm your password')).toBeEnabled());

  fireEvent.click(submitButton);
});

test('handles password validation', async () => {
  render(
    <Register />
  );

  const fileInput = screen.getByPlaceholderText("na");
  const nameInput = screen.getByLabelText('Name');
  const lastNameInput = screen.getByLabelText('Last Name');
  const emailInput = screen.getByLabelText('Email address');
  const phoneInput = screen.getByLabelText('Phone Number');
  const passwordInput = screen.getByLabelText('Password');
  const confirmPasswordInput = screen.getByLabelText('Confirm Password');
  const submitButton = screen.getByRole('button', { name: 'Sign Up', type: 'submit' });

  fireEvent.change(fileInput, { target: { files: [mockFile] } });

  fireEvent.change(nameInput, { target: { value: 'Test Name' } });
  fireEvent.change(lastNameInput, { target: { value: 'Test Last Name' } });
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(phoneInput, { target: { value: '1234567890' } });
  fireEvent.change(passwordInput, { target: { value: 'short' } });
  fireEvent.change(confirmPasswordInput, { target: { value: 'short' } });

  await waitFor(() => expect(submitButton).toBeEnabled());

  fireEvent.click(submitButton);

  expect(axios.post).toHaveBeenCalledTimes(0);
});

test('handles password mismatch', async () => {
  render(
    <Register />
  );

  const fileInput = screen.getByPlaceholderText("na");
  const nameInput = screen.getByLabelText('Name');
  const lastNameInput = screen.getByLabelText('Last Name');
  const emailInput = screen.getByLabelText('Email address');
  const phoneInput = screen.getByLabelText('Phone Number');
  const passwordInput = screen.getByLabelText('Password');
  const confirmPasswordInput = screen.getByLabelText('Confirm Password');
  const submitButton = screen.getByRole('button', { name: 'Sign Up', type: 'submit' });

  const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
  fireEvent.change(fileInput, { target: { files: [mockFile] } });

  fireEvent.change(nameInput, { target: { value: 'Test Name' } });
  fireEvent.change(lastNameInput, { target: { value: 'Test Last Name' } });
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(phoneInput, { target: { value: '1234567890' } });
  fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
  fireEvent.change(confirmPasswordInput, { target: { value: 'wrongpassword' } });

  await waitFor(() => expect(submitButton).toBeEnabled());

  fireEvent.click(submitButton);

  expect(axios.post).toHaveBeenCalledTimes(0);
});