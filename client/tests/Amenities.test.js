import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { AuthContext } from '../src/AuthContext.js';
import Amenities from "../src/pages/Amenities.jsx"
import axios from 'axios';
import React, { useState as useStateMock } from 'react';

module.exports = 'test-file-stub';

afterEach(() => {
  cleanup();
})

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(React, 'useContext').mockReturnValue({
    userId: '123',
    isLoggedIn: true,
    userRol: 'admin',
  });
});

// Mock event object
const mockFile = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('axios')

test('successful amenity upload', async () => {
  render(
    <AuthContext.Provider value={{ userId: '123', isLoggedIn: true, userRol: 'admin' }}>
      <Amenities />
    </AuthContext.Provider>
  );
  // Fill out the form fields
  fireEvent.change(screen.getByLabelText('Choose an icon'), { target: { files: [mockFile] } });
  fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'mock_title' } });
  fireEvent.change(screen.getByLabelText('Fee'), { target: { value: 10050.90 } });
  fireEvent.click(screen.getByText('Upload Amenity'));

  await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
  expect(axios.post).toHaveBeenCalledWith('/upload', expect.any(Object), { "headers": { "Content-Type": "multipart/form-data" } });
});

