import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import React from 'react';
import Amenities from "../src/pages/Amenities.jsx"
import axios from 'axios';
module.exports = 'test-file-stub';

const app = require('../../api/index.js');
let agent; 

beforeAll(() => {
  render(<Amenities />);
  agent = require('supertest').agent(app);
});

afterEach(() => {
  cleanup();
})

beforeEach(() => {
  jest.clearAllMocks();
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
  // Fill out the form fields
  fireEvent.change(screen.getByLabelText('Choose an icon'), { target: { files: [mockFile] } });
  fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'mock_title' } });
  fireEvent.change(screen.getByLabelText('Fee'), { target: { value: 10050.90 } });
  fireEvent.click(screen.getByText('Upload Amenity'));

  await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(2));
  expect(axios.post).toHaveBeenCalledWith('/upload', expect.any(Object), {"headers": {"Content-Type": "multipart/form-data"}});
  expect(axios.post).toHaveBeenCalledWith('/amenities/add_amenity', expect.any(Object));
});
