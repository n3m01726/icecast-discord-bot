const { jest } = require('@jest/globals');
const messageCreate = require('../../events/messageCreate');

describe('messageCreate event handler', () => {
    let mockMessage;

    beforeEach(() => {
        mockMessage = {
            author: { bot: false },
            mentions: { has: jest.fn() },
            client: {
                user: {},
                config: { PREFIX: '!' },
                commands: new Map(),
            },
            content: '',
            reply: jest.fn(),
        };
        console.log = jest.fn();
        console.error = jest.fn();
    });

    it('should not process messages from bots', () => {
        mockMessage.author.bot = true;
        messageCreate.execute(mockMessage);
        expect(console.log).not.toHaveBeenCalledWith('messageCreate event triggered');
    });

    it('should not process messages mentioning the bot', () => {
        mockMessage.mentions.has.mockReturnValue(true);
        messageCreate.execute(mockMessage);
        expect(console.log).not.toHaveBeenCalledWith('messageCreate event triggered');
    });

    it('should not process messages without the correct prefix', () => {
        mockMessage.content = 'hello';
        messageCreate.execute(mockMessage);
        expect(console.log).not.toHaveBeenCalledWith('Message avec préfixe détecté: hello');
    });

    it('should log and process valid commands', () => {
        mockMessage.content = '!test';
        const mockCommand = { execute: jest.fn() };
        mockMessage.client.commands.set('test', mockCommand);

        messageCreate.execute(mockMessage);

        expect(console.log).toHaveBeenCalledWith('messageCreate event triggered');
        expect(console.log).toHaveBeenCalledWith('Message avec préfixe détecté: !test');
        expect(console.log).toHaveBeenCalledWith('Commande détectée: test');
        expect(mockCommand.execute).toHaveBeenCalledWith(mockMessage, []);
    });

    it('should log when a command is not found', () => {
        mockMessage.content = '!unknown';
        messageCreate.execute(mockMessage);

        expect(console.log).toHaveBeenCalledWith('Commande non trouvée: unknown');
    });

    it('should handle errors during command execution', () => {
        mockMessage.content = '!error';
        const mockCommand = {
            execute: jest.fn(() => {
                throw new Error('Test error');
            }),
        };
        mockMessage.client.commands.set('error', mockCommand);

        messageCreate.execute(mockMessage);

        expect(console.error).toHaveBeenCalled();
        expect(mockMessage.reply).toHaveBeenCalledWith(
            "Il y a eu une erreur en essayant d'exécuter cette commande!"
        );
    });
});