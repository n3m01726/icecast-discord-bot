const { getVoiceConnection } = require('@discordjs/voice');
const { ADMIN_ROLE_ID } = require('../../config');
const stopCommand = require('../../commands/stop');

jest.mock('@discordjs/voice', () => ({
    getVoiceConnection: jest.fn(),
}));

describe('stop command', () => {
    let message;

    beforeEach(() => {
        message = {
            member: {
                roles: {
                    cache: new Map(),
                },
            },
            guild: {
                id: 'guild-id',
            },
            reply: jest.fn(),
        };
    });

    it('should reply that the command is reserved for administrators if the user is not an admin', async () => {
        await stopCommand.execute(message);
        expect(message.reply).toHaveBeenCalledWith("Cette commande est réservée aux administrateurs.");
    });

    it('should reply that the bot is not connected to a voice channel if there is no connection', async () => {
        message.member.roles.cache.set(ADMIN_ROLE_ID, true);
        getVoiceConnection.mockReturnValue(null);

        await stopCommand.execute(message);
        expect(message.reply).toHaveBeenCalledWith("Le bot n'est pas connecté à un salon vocal.");
    });

    it('should destroy the connection and reply that the stream has been stopped if there is a connection', async () => {
        const mockConnection = { destroy: jest.fn() };
        message.member.roles.cache.set(ADMIN_ROLE_ID, true);
        getVoiceConnection.mockReturnValue(mockConnection);

        await stopCommand.execute(message);
        expect(mockConnection.destroy).toHaveBeenCalled();
        expect(message.reply).toHaveBeenCalledWith("Le stream a été arrêté et le bot a quitté le salon vocal.");
    });
});