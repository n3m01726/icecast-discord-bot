const axios = require('axios');
const nowplaying = require('../../commands/nowplaying');

jest.mock('axios'); // Mock axios to control its behavior

describe('nowplaying command', () => {
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

  test('should reply with the currently playing song when API returns valid data', async () => {
    // Mock axios response with valid song data
    axios.get.mockResolvedValueOnce({
      data: {
        icestats: {
          source: {
            title: 'Test Song - Test Artist',
          },
        },
      },
    });

    await nowplaying.execute(mockMessage);

    expect(axios.get).toHaveBeenCalledWith('https://stream.soundshineradio.com:8445/status-json.xsl');
    expect(mockMessage.reply).toHaveBeenCalledWith('🎶 Présentement | 🎶 Now playing: **Test Song - Test Artist**');
  });

  test('should reply with "No song information available" when API returns no song data', async () => {
    // Mock axios response with no song data
    axios.get.mockResolvedValueOnce({
      data: {
        icestats: {
          source: {},
        },
      },
    });

    await nowplaying.execute(mockMessage);

    expect(axios.get).toHaveBeenCalledWith('https://stream.soundshineradio.com:8445/status-json.xsl');
    expect(mockMessage.reply).toHaveBeenCalledWith('🎶 Présentement | 🎶 Now playing: **No song information available**');
  });

  test('should reply with an error message when API request fails', async () => {
    // Mock axios to throw an error
    axios.get.mockRejectedValueOnce(new Error('Network error'));

    await nowplaying.execute(mockMessage);

    expect(axios.get).toHaveBeenCalledWith('https://stream.soundshineradio.com:8445/status-json.xsl');
    expect(mockMessage.reply).toHaveBeenCalledWith('Unable to fetch current song.');
  });
});