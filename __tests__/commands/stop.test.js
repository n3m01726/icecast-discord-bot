const { getVoiceConnection } = require('@discordjs/voice');
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
                    cache: {
                        has: jest.fn(),
                    },
                },
            },
            guild: {
                id: 'guild-id',
            },
            reply: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should reply with an error if the user is not an admin', async () => {
        message.member.roles.cache.has.mockReturnValue(false);

        await stopCommand.execute(message);

        expect(message.reply).toHaveBeenCalledWith("Cette commande est réservée aux administrateurs.");
        expect(getVoiceConnection).not.toHaveBeenCalled();
    });

    it('should reply with a message if the bot is not connected to a voice channel', async () => {
        message.member.roles.cache.has.mockReturnValue(true);
        getVoiceConnection.mockReturnValue(null);

        await stopCommand.execute(message);

        expect(message.reply).toHaveBeenCalledWith("Le bot n'est pas connecté à un salon vocal.");
    });

    it('should disconnect the bot and reply with a success message if connected to a voice channel', async () => {
        const mockConnection = { destroy: jest.fn() };
        message.member.roles.cache.has.mockReturnValue(true);
        getVoiceConnection.mockReturnValue(mockConnection);

        await stopCommand.execute(message);

        expect(mockConnection.destroy).toHaveBeenCalled();
        expect(message.reply).toHaveBeenCalledWith("Le stream a été arrêté et le bot a quitté le salon vocal.");
    });
});