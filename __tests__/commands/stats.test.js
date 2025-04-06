const { execute } = require('../../commands/stats');
const axios = require('axios');

jest.mock('axios');

describe('stats command', () => {
    const mockMessage = {
        member: {
            roles: {
                cache: {
                    has: jest.fn(),
                },
            },
        },
        reply: jest.fn(),
        channel: {
            send: jest.fn(),
        },
    };

    const ADMIN_ROLE_ID = 'admin-role-id';
    const JSON_URL = 'http://example.com/stats.json';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should reply with an error if the user is not an admin', async () => {
        mockMessage.member.roles.cache.has.mockReturnValue(false);

        await execute(mockMessage, []);

        expect(mockMessage.reply).toHaveBeenCalledWith("Vous devez être administrateur pour exécuter cette commande.");
        expect(mockMessage.channel.send).not.toHaveBeenCalled();
    });

    it('should fetch and send stats if the user is an admin', async () => {
        mockMessage.member.roles.cache.has.mockReturnValue(true);
        axios.get.mockResolvedValue({
            data: {
                icestats: {
                    source: {
                        listeners: 10,
                        bitrate: 128,
                    },
                },
            },
        });

        await execute(mockMessage, []);

        expect(axios.get).toHaveBeenCalledWith(JSON_URL);
        expect(mockMessage.channel.send).toHaveBeenCalledWith(
            "📊 **Stream Stats**:\n👂 **Current listeners**: 10\n📈 **Bitrate**: 128 kbps"
        );
    });

    it('should handle errors when fetching stats', async () => {
        mockMessage.member.roles.cache.has.mockReturnValue(true);
        axios.get.mockRejectedValue(new Error('Network error'));

        await execute(mockMessage, []);

        expect(axios.get).toHaveBeenCalledWith(JSON_URL);
        expect(mockMessage.reply).toHaveBeenCalledWith("Impossible de récupérer les statistiques du stream.");
    });
});