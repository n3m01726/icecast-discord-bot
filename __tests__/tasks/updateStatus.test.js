const axios = require('axios');
const { ActivityType } = require('discord.js');
const updateStatusModule = require('../../tasks/updateStatus');

jest.mock('axios');

describe('updateStatus', () => {
    let mockClient;

    beforeEach(() => {
        mockClient = {
            user: {
                setActivity: jest.fn(),
            },
        };
        jest.clearAllMocks();
    });

    it('should set activity with the current song when data is available', async () => {
        const mockData = {
            icestats: {
                source: {
                    title: 'Test Song',
                },
            },
        };
        axios.get.mockResolvedValueOnce({ data: mockData });

        await updateStatusModule.execute(mockClient);

        expect(axios.get).toHaveBeenCalledWith(expect.any(String), { timeout: 10000 });
        expect(mockClient.user.setActivity).toHaveBeenCalledWith(
            { name: '📀 Test Song', type: ActivityType.Custom, url: 'https://soundshineradio.com' }
        );
    });

    it('should set activity with a fallback message when no song title is available', async () => {
        const mockData = {
            icestats: {
                source: {},
            },
        };
        axios.get.mockResolvedValueOnce({ data: mockData });

        await updateStatusModule.execute(mockClient);

        expect(mockClient.user.setActivity).toHaveBeenCalledWith(
            { name: '📀 No title available', type: ActivityType.Custom, url: 'https://soundshineradio.com' }
        );
    });

    it('should set activity with a default message when data is unavailable', async () => {
        axios.get.mockResolvedValueOnce({ data: {} });

        await updateStatusModule.execute(mockClient);

        expect(mockClient.user.setActivity).toHaveBeenCalledWith(
            { name: '📀 Stream offline or no song information available', type: ActivityType.Custom, url: 'https://soundshineradio.com' }
        );
    });

    it('should set fallback activity when an error occurs', async () => {
        axios.get.mockRejectedValueOnce(new Error('Network error'));

        await updateStatusModule.execute(mockClient);

        expect(mockClient.user.setActivity).toHaveBeenCalledWith(
            'Soundshine Radio',
            { type: 'LISTENING' }
        );
    });
});