const { joinVoiceChannel } = require('@discordjs/voice');
const { execute: ensureConnected } = require('../../tasks/ensureConnected');

jest.mock('@discordjs/voice', () => ({
    joinVoiceChannel: jest.fn(),
}));

describe('ensureConnected', () => {
    let bot;

    beforeEach(() => {
        bot = {
            channels: {
                cache: new Map(),
            },
            voice: {
                connections: new Map(),
            },
        };
        console.error = jest.fn();
        console.log = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should log an error if the voice channel is not found', async () => {
        await ensureConnected(bot);
        expect(console.error).toHaveBeenCalledWith('Le canal vocal spécifié est introuvable.');
    });

    it('should connect to the voice channel if not already connected', async () => {
        const mockVoiceChannel = {
            id: '12345',
            name: 'Test Voice Channel',
            guild: {
                id: '67890',
                voiceAdapterCreator: jest.fn(),
            },
        };

        bot.channels.cache.set('VOICE_CHANNEL_ID', mockVoiceChannel);

        await ensureConnected(bot);

        expect(joinVoiceChannel).toHaveBeenCalledWith({
            channelId: mockVoiceChannel.id,
            guildId: mockVoiceChannel.guild.id,
            adapterCreator: mockVoiceChannel.guild.voiceAdapterCreator,
        });
        expect(console.log).toHaveBeenCalledWith(`Connecté au canal vocal: ${mockVoiceChannel.name}`);
    });

    it('should not attempt to connect if already connected', async () => {
        const mockVoiceChannel = {
            id: '12345',
            name: 'Test Voice Channel',
            guild: {
                id: '67890',
                voiceAdapterCreator: jest.fn(),
            },
        };

        bot.channels.cache.set('VOICE_CHANNEL_ID', mockVoiceChannel);
        bot.voice.connections.set('12345', {});

        await ensureConnected(bot);

        expect(joinVoiceChannel).not.toHaveBeenCalled();
    });

    it('should log an error if an exception occurs during connection', async () => {
        const mockVoiceChannel = {
            id: '12345',
            name: 'Test Voice Channel',
            guild: {
                id: '67890',
                voiceAdapterCreator: jest.fn(),
            },
        };

        bot.channels.cache.set('VOICE_CHANNEL_ID', mockVoiceChannel);
        joinVoiceChannel.mockImplementation(() => {
            throw new Error('Connection error');
        });

        await ensureConnected(bot);

        expect(console.error).toHaveBeenCalledWith('Erreur lors de la connexion au canal vocal:', expect.any(Error));
    });
});