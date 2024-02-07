import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import axiosCustom from '../../api/AxiosCustom'; 

// Create a new instance of the axios-mock-adapter
const mock = new MockAdapter(axios);

// Mock the token refresh function
mock.onPost('/api/token_refresh', { withCredentials: true }).reply(200, { token: 'newToken' });

describe('axiosCustom', () => {
  afterEach(() => {
    mock.reset(); // Reset the mock adapter after each test
  });

  it('throws error if JWT token refresh fails', async () => {
    // Mock the expired JWT token response
    mock.onGet('/api/test').reply(401, { message: 'JWT expired' });

    // Mock the token refresh function to fail
    mock.onPost('/api/token_refresh').reply(500);

    // Make a request that would result in a 401 error
    await expect(axiosCustom.get('/api/test')).rejects.toThrowError();
  });
});