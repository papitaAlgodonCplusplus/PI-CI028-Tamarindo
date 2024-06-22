import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { AuthContext } from '../src/AuthContext.js';
import axios from 'axios';
import '../styles/index.css';
import '@testing-library/jest-dom'
import Rooms from '../src/pages/Rooms.jsx';
import { showErrorDialog, postDataWithTimeout } from '../src/Misc.js';
module.exports = 'test-file-stub';

jest.mock('../src/Misc.js', () => ({
  showErrorDialog: jest.fn(),
  postDataWithTimeout: jest.fn(),
}));

const mockFile = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));
jest.mock('axios');

describe('Rooms', () => {
  it('handles form submission', async () => {
    const isLoggedIn = true;
    const userRol = 'admin';
    const room_types = [
      {
        categoryid: 1,
        class_name: 'Single Room',
      },
      {
        categoryid: 2,
        class_name: 'Double Room',
      },
    ];

    const data = {
      title: 'Room Title',
      description: 'Room Description',
    };

    const roomTypeOption = '1';

    render(
      <AuthContext.Provider value={{ isLoggedIn, userRol }}>
        <Rooms room_types={room_types} data={data} roomTypeOption={roomTypeOption} />
      </AuthContext.Provider>
    );

    const fileInput = screen.getByText('Choose images (5 max)');
    const titleInput = screen.getByLabelText('Title');
    const descriptionInput = screen.getByLabelText('Description');
    const submitButton = screen.getByText('Add');

    fireEvent.change(fileInput, { target: { files: [] } });
    await waitFor(() => expect(screen.getByText('Please provide a photo')).toBeEnabled());

    fireEvent.change(titleInput, { target: { value: '' } });
    await waitFor(() => expect(screen.getByText('Please provide a title')).toBeEnabled());

    fireEvent.change(descriptionInput, { target: { value: '' } });
    await waitFor(() => expect(screen.getByText('Please provide a description')).toBeEnabled());

    fireEvent.change(fileInput, { target: { files: [mockFile] } });
    fireEvent.change(titleInput, { target: { value: 'Test' } });
    fireEvent.change(descriptionInput, { target: { value: 'testing' } });
    fireEvent.click(submitButton);

    expect(showErrorDialog).toHaveBeenCalledTimes(1);
  });

  it('renders the room form', async () => {
    const isLoggedIn = true;
    const userRol = 'admin';
    const room_types = [
      {
        categoryid: 1,
        class_name: 'Single Rooms',
      },
      {
        categoryid: 2,
        class_name: 'Double Rooms',
      },
    ];

    const data = {
      title: 'Rooms Title',
      description: 'Rooms Description',
    };

    const roomTypeOption = '1';

    render(
      <AuthContext.Provider value={{ isLoggedIn, userRol }}>
        <Rooms room_types={room_types} data={data} roomTypeOption={roomTypeOption} />
      </AuthContext.Provider>
    );

    expect(screen.getByText('Add Room')).toBeInTheDocument();
    expect(screen.getByText('Update Room')).toBeInTheDocument();
  });
});