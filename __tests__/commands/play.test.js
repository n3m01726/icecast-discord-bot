const { execute } = require('../../commands/play');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { checkStreamOnline } = require('../../utils/checkStreamOnline');
const { STREAM_URL } = require('../../config');

jest.mock('@discordjs/voice', () => ({
    joinVoiceChannel: jest.fn(),
    createAudioPlayer: jest.fn(() => ({
        play: jest.fn(),
        on: jest.fn(),
    })),
    createAudioResource: jest.fn(),
    AudioPlayerStatus: { Idle: 'idle' },
}));

jest.mock('../utils/checkStreamOnline', () => ({
    checkStreamOnline: jest.fn(),
}));

jest.mock('../config', () => ({
    STREAM_URL: 'http://example.com/stream',
}));

describe('play command', () => {
    let message;

    beforeEach(() => {
        message = {
            member: {
                voice: {
                    channel: {
                        id: 'voiceChannelId',
                        type: 13, // Stage Channel
                    },
                },
            },
            guild: {
                id: 'guildId',
                voiceAdapterCreator: jest.fn(),
                members: {
                    me: {
                        voice: {
                            setSuppressed: jest.fn(),
                        },
                    },
                },
            },
            reply: jest.fn(),
        };

        jest.clearAllMocks();
    });

    it('should reply if the user is not in a voice channel', async () => {
        message.member.voice.channel = null;

        await execute(message);

        expect(message.reply).toHaveBeenCalledWith("You must join a voice channel first!");
    });

    it('should reply if the stream is offline', async () => {
        checkStreamOnline.mockResolvedValue(false);

        await execute(message);

        expect(checkStreamOnline).toHaveBeenCalled();
        expect(message.reply).toHaveBeenCalledWith("❌ The stream is offline, please try again later.");
    });

    it('should join the voice channel and play the stream', async () => {
        checkStreamOnline.mockResolvedValue(true);
        const mockPlayer = createAudioPlayer();
        const mockResource = {};

        createAudioResource.mockReturnValue(mockResource);

        await execute(message);

        expect(checkStreamOnline).toHaveBeenCalled();
        expect(joinVoiceChannel).toHaveBeenCalledWith({
            channelId: 'voiceChannelId',
            guildId: 'guildId',
            adapterCreator: message.guild.voiceAdapterCreator,
            selfDeaf: false,
        });
        expect(createAudioPlayer).toHaveBeenCalled();
        expect(createAudioResource).toHaveBeenCalledWith(STREAM_URL);
        expect(mockPlayer.play).toHaveBeenCalledWith(mockResource);
        expect(mockPlayer.on).toHaveBeenCalledWith(AudioPlayerStatus.Idle, expect.any(Function));
        expect(message.reply).toHaveBeenCalledWith("🎶 The stream is now playing!");
    });

    it('should request to speak if the channel is a Stage Channel', async () => {
        checkStreamOnline.mockResolvedValue(true);

        await execute(message);

        expect(message.guild.members.me.voice.setSuppressed).toHaveBeenCalledWith(false);
    });

    it('should handle errors when requesting to speak', async () => {
        checkStreamOnline.mockResolvedValue(true);
        message.guild.members.me.voice.setSuppressed.mockRejectedValue(new Error('Permission error'));

        await execute(message);

        expect(message.guild.members.me.voice.setSuppressed).toHaveBeenCalledWith(false);
        expect(message.reply).toHaveBeenCalledWith("🎶 The stream is now playing!");
    });
});