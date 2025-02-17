import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoginScreen from '../screens/LoginScreen'; 
import axios from 'axios';
jest.mock('axios');

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

jest.mock('../context/UserContext', () => ({
  useUser: () => ({
    setUser: jest.fn(),
  }),
}));

describe('LoginScreen', () => {
  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    expect(getByPlaceholderText('Enter Secret Key')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
  });

  it('handles login button press', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    axios.post.mockResolvedValueOnce({
      data: { user: { id: 1, name: 'Test User' } },
    });

    const input = getByPlaceholderText('Enter Secret Key');
    fireEvent.changeText(input, 'test-secret-key');

    const button = getByText('Login');
    fireEvent.press(button);

    expect(axios.post).toHaveBeenCalledWith(
      'http://172.16.11.246:5000/api/auth/login',
      { secretKey: 'test-secret-key' }
    );
  });

  it('displays error message on login failure', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(<LoginScreen />);

    axios.post.mockRejectedValueOnce({
      response: { data: 'Invalid secret key' },
    });

    const input = getByPlaceholderText('Enter Secret Key');
    fireEvent.changeText(input, 'invalid-secret-key');
    const button = getByText('Login');
    fireEvent.press(button);

    const errorMessage = await findByText('Invalid secret key or error with server.');
    expect(errorMessage).toBeTruthy();
  });
});