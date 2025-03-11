const axios = require('axios');
const { JSON_URL } = require('../../config');
const { ActivityType } = require('discord.js');
const { updateStatus } = require('../../tasks/updateStatus');

jest.mock('axios');
jest.mock('discord.js', () => ({
    ActivityType: {
        Custom: 'CUSTOM',
        LISTENING: 'LISTENING'
    }
}));

describe('updateStatus', () => {
    let client;

    beforeEach(() => {
        client = {
            user: {
                setActivity: jest.fn()
            }
        };
    });

    it('should update status with current song title', async () => {
        const mockData = {
            icestats: {
                source: {
                    title: 'Test Song'
                }
            }
        };
        axios.get.mockResolvedValue({ data: mockData });

        await updateStatus(client);

        expect(client.user.setActivity).toHaveBeenCalledWith(
            { name: '📀 Test Song', type: 'CUSTOM', url: 'https://soundshineradio.com' }
        );
    });

    it('should update status with fallback message when no song information is available', async () => {
        const mockData = {};
        axios.get.mockResolvedValue({ data: mockData });

        await updateStatus(client);

        expect(client.user.setActivity).toHaveBeenCalledWith(
            { name: '📀 Stream offline or no song information available', type: 'CUSTOM', url: 'https://soundshineradio.com' }
        );
    });

    it('should set fallback activity on error', async () => {
        axios.get.mockRejectedValue(new Error('Network Error'));

        await updateStatus(client);

        expect(client.user.setActivity).toHaveBeenCalledWith(
            'Soundshine Radio', { type: 'LISTENING' }
        );
    });
});