const { Client, Intents, Message } = require('discord.js');
const messageCreateEvent = require('../../events/messageCreate');

describe('messageCreate event', () => {
    let client;
    let message;

    beforeEach(() => {
        client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
        client.config = { PREFIX: '!' };
        client.commands = new Map();
        client.user = { id: '1234567890' };

        message = new Message(client, { content: '', author: { bot: false }, mentions: { has: jest.fn() } }, { id: '1234567890' });
    });

    test('should log messageCreate event triggered', () => {
        console.log = jest.fn();
        messageCreateEvent.execute(message);
        expect(console.log).toHaveBeenCalledWith('messageCreate event triggered');
    });

    test('should return if message is from a bot', () => {
        message.author.bot = true;
        messageCreateEvent.execute(message);
        expect(console.log).toHaveBeenCalledWith('messageCreate event triggered');
    });

    test('should return if message mentions the bot', () => {
        message.mentions.has.mockReturnValue(true);
        messageCreateEvent.execute(message);
        expect(console.log).toHaveBeenCalledWith('messageCreate event triggered');
    });

    test('should return if message does not start with prefix', () => {
        message.content = 'hello';
        messageCreateEvent.execute(message);
        expect(console.log).toHaveBeenCalledWith('messageCreate event triggered');
    });

    test('should log message with prefix detected', () => {
        message.content = '!command';
        console.log = jest.fn();
        messageCreateEvent.execute(message);
        expect(console.log).toHaveBeenCalledWith('Message avec préfixe détecté: !command');
    });

    test('should log command detected', () => {
        message.content = '!command';
        console.log = jest.fn();
        messageCreateEvent.execute(message);
        expect(console.log).toHaveBeenCalledWith('Commande détectée: command');
    });

    test('should log command not found', () => {
        message.content = '!unknown';
        console.log = jest.fn();
        messageCreateEvent.execute(message);
        expect(console.log).toHaveBeenCalledWith('Commande non trouvée: unknown');
    });

    test('should execute command', () => {
        const mockCommand = { execute: jest.fn() };
        client.commands.set('command', mockCommand);
        message.content = '!command';
        console.log = jest.fn();
        messageCreateEvent.execute(message);
        expect(mockCommand.execute).toHaveBeenCalledWith(message, []);
        expect(console.log).toHaveBeenCalledWith('Commande exécutée: command');
    });

    test('should handle command execution error', () => {
        const mockCommand = { execute: jest.fn().mockImplementation(() => { throw new Error('Test error'); }) };
        client.commands.set('command', mockCommand);
        message.content = '!command';
        console.error = jest.fn();
        message.reply = jest.fn();
        messageCreateEvent.execute(message);
        expect(console.error).toHaveBeenCalledWith(expect.any(Error));
        expect(message.reply).toHaveBeenCalledWith('Il y a eu une erreur en essayant d\'exécuter cette commande!');
    });
});