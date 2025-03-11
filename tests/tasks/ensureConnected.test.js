const { VOICE_CHANNEL_ID } = require('../../config');
const { joinVoiceChannel } = require('@discordjs/voice');
const ensureConnected = require('../../tasks/ensureConnected').execute;

jest.mock('@discordjs/voice', () => ({
    joinVoiceChannel: jest.fn(),
}));

const mockBot = {
    channels: {
        cache: new Map(),
    },
    voice: {
        connections: new Map(),
    },
};

describe('ensureConnected', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should log an error if the voice channel is not found', async () => {
        console.error = jest.fn();

        await ensureConnected(mockBot);

        expect(console.error).toHaveBeenCalledWith('Le canal vocal spécifié est introuvable.');
    });

    test('should join the voice channel if not already connected', async () => {
        const mockVoiceChannel = {
            id: '123',
            name: 'Test Channel',
            guild: {
                id: '456',
                voiceAdapterCreator: {},
            },
        };
        mockBot.channels.cache.set(VOICE_CHANNEL_ID, mockVoiceChannel);
        mockBot.voice.connections.clear();

        await ensureConnected(mockBot);

        expect(joinVoiceChannel).toHaveBeenCalledWith({
            channelId: mockVoiceChannel.id,
            guildId: mockVoiceChannel.guild.id,
            adapterCreator: mockVoiceChannel.guild.voiceAdapterCreator,
        });
        expect(console.log).toHaveBeenCalledWith(`Connecté au canal vocal: ${mockVoiceChannel.name}`);
    });

    test('should not join the voice channel if already connected', async () => {
        const mockVoiceChannel = {
            id: '123',
            name: 'Test Channel',
            guild: {
                id: '456',
                voiceAdapterCreator: {},
            },
        };
        mockBot.channels.cache.set(VOICE_CHANNEL_ID, mockVoiceChannel);
        mockBot.voice.connections.set('123', {});

        await ensureConnected(mockBot);

        expect(joinVoiceChannel).not.toHaveBeenCalled();
    });

    test('should log an error if joining the voice channel fails', async () => {
        const mockVoiceChannel = {
            id: '123',
            name: 'Test Channel',
            guild: {
                id: '456',
                voiceAdapterCreator: {},
            },
        };
        mockBot.channels.cache.set(VOICE_CHANNEL_ID, mockVoiceChannel);
        mockBot.voice.connections.clear();
        joinVoiceChannel.mockImplementation(() => {
            throw new Error('Connection failed');
        });
        console.error = jest.fn();

        await ensureConnected(mockBot);

        expect(console.error).toHaveBeenCalledWith('Erreur lors de la connexion au canal vocal:', expect.any(Error));
    });
});