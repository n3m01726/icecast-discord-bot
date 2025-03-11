const { execute } = require('../../commands/nowplaying');
const axios = require('axios');
const { Message } = require('discord.js');

jest.mock('axios');

describe('nowplaying command', () => {
    let message;

    beforeEach(() => {
        message = {
            reply: jest.fn(),
        };
    });

    it('should reply with the current song when data is available', async () => {
        const mockData = {
            icestats: {
                source: {
                    title: 'Test Song - Test Artist',
                },
            },
        };

        axios.get.mockResolvedValue({ data: mockData });

        await execute(message);

        expect(axios.get).toHaveBeenCalledWith("https://stream.soundshineradio.com:8445/status-json.xsl");
        expect(message.reply).toHaveBeenCalledWith('🎶 Now playing: **Test Song - Test Artist**');
    });

    it('should reply with a default message when no song information is available', async () => {
        const mockData = {
            icestats: {
                source: {},
            },
        };

        axios.get.mockResolvedValue({ data: mockData });

        await execute(message);

        expect(axios.get).toHaveBeenCalledWith("https://stream.soundshineradio.com:8445/status-json.xsl");
        expect(message.reply).toHaveBeenCalledWith('🎶 Now playing: **No song information available**');
    });

    it('should reply with an error message when the request fails', async () => {
        axios.get.mockRejectedValue(new Error('Network Error'));

        await execute(message);

        expect(axios.get).toHaveBeenCalledWith("https://stream.soundshineradio.com:8445/status-json.xsl");
        expect(message.reply).toHaveBeenCalledWith('Unable to fetch current song.');
    });
});