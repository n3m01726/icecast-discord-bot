const { ADMIN_ROLE_ID, JSON_URL } = require('../../config');
const { Client, Intents } = require('discord.js');
const axios = require('axios');
const statsCommand = require('../../commands/stats');

jest.mock('axios');
jest.mock('../config', () => ({
    ADMIN_ROLE_ID: 'admin-role-id',
    JSON_URL: 'http://example.com/stats.json'
}));

describe('stats command', () => {
    let message;

    beforeEach(() => {
        message = {
            member: {
                roles: {
                    cache: {
                        has: jest.fn()
                    }
                }
            },
            reply: jest.fn(),
            channel: {
                send: jest.fn()
            }
        };
    });

    it('should reply with an error if the user is not an admin', async () => {
        message.member.roles.cache.has.mockReturnValue(false);

        await statsCommand.execute(message);

        expect(message.reply).toHaveBeenCalledWith("Vous devez être administrateur pour exécuter cette commande.");
    });

    it('should fetch and send stream stats if the user is an admin', async () => {
        message.member.roles.cache.has.mockReturnValue(true);
        axios.get.mockResolvedValue({
            data: {
                icestats: {
                    source: {
                        listeners: 10,
                        bitrate: 128
                    }
                }
            }
        });

        await statsCommand.execute(message);

        expect(axios.get).toHaveBeenCalledWith(JSON_URL);
        expect(message.channel.send).toHaveBeenCalledWith(
            '📊 **Stream Stats**:\n👂 **Current listeners**: 10\n📈 **Bitrate**: 128 kbps'
        );
    });

    it('should handle errors when fetching stream stats', async () => {
        message.member.roles.cache.has.mockReturnValue(true);
        axios.get.mockRejectedValue(new Error('Network error'));

        await statsCommand.execute(message);

        expect(axios.get).toHaveBeenCalledWith(JSON_URL);
        expect(message.reply).toHaveBeenCalledWith("Impossible de récupérer les statistiques du stream.");
    });
});