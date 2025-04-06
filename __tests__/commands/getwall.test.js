const axios = require('axios');
const getwall = require('../../commands/getwall');

// commands/getwall.test.js

jest.mock('axios'); // Mock axios to control its behavior

describe('getwall command', () => {
  let mockMessage;

  beforeEach(() => {
    // Mock the message object
    mockMessage = {
      reply: jest.fn(), // Mock the reply method
    };
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  test('should reply with a photo URL when Unsplash API returns a valid response', async () => {
    // Mock axios response
    axios.get.mockResolvedValueOnce({
      data: [
        {
          urls: {
            regular: 'https://example.com/photo.jpg',
          },
        },
      ],
    });

    await getwall.execute(mockMessage);

    expect(axios.get).toHaveBeenCalledWith(
      `https://api.unsplash.com/photos/random?client_id=${process.env.UNSPLASH_API}&count=1`
    );
    expect(mockMessage.reply).toHaveBeenCalledWith('https://example.com/photo.jpg');
  });

  test('should reply with an error message when Unsplash API returns no photo', async () => {
    // Mock axios response with no photo
    axios.get.mockResolvedValueOnce({
      data: [],
    });

    await getwall.execute(mockMessage);

    expect(axios.get).toHaveBeenCalledWith(
      `https://api.unsplash.com/photos/random?client_id=${process.env.UNSPLASH_API}&count=1`
    );
    expect(mockMessage.reply).toHaveBeenCalledWith("Couldn't fetch a photo, try again later.");
  });

  test('should reply with an error message when an exception occurs', async () => {
    // Mock axios to throw an error
    axios.get.mockRejectedValueOnce(new Error('Network error'));

    await getwall.execute(mockMessage);

    expect(axios.get).toHaveBeenCalledWith(
      `https://api.unsplash.com/photos/random?client_id=${process.env.UNSPLASH_API}&count=1`
    );
    expect(mockMessage.reply).toHaveBeenCalledWith('Unable to fetch a random photo.');
  });
});