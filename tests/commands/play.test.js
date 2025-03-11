const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { checkStreamOnline } = require('../../utils/checkStreamOnline');
const { STREAM_URL } = require('../../config');
const playCommand = require('../../commands/play');

jest.mock('@discordjs/voice', () => ({
    joinVoiceChannel: jest.fn(),
    createAudioPlayer: jest.fn(),
    createAudioResource: jest.fn(),
    AudioPlayerStatus: {
        Idle: 'idle',
    },
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
                        type: 2, // Regular voice channel
                    },
                },
            },
            guild: {
                id: 'guildId',
                members: {
                    me: {
                        voice: {
                            setSuppressed: jest.fn(),
                        },
                    },
                },
                voiceAdapterCreator: jest.fn(),
            },
            reply: jest.fn(),
        };
    });

    it('should reply with an error if the user is not in a voice channel', async () => {
        message.member.voice.channel = null;

        await playCommand.execute(message);

        expect(message.reply).toHaveBeenCalledWith("You must join a voice channel first!");
    });

    it('should reply with an error if the stream is offline', async () => {
        checkStreamOnline.mockResolvedValue(false);

        await playCommand.execute(message);

        expect(message.reply).toHaveBeenCalledWith("❌ The stream is offline, please try again later.");
    });

    it('should join the voice channel and play the stream', async () => {
        checkStreamOnline.mockResolvedValue(true);
        const connection = {
            subscribe: jest.fn(),
            destroy: jest.fn(),
        };
        joinVoiceChannel.mockReturnValue(connection);
        const player = {
            play: jest.fn(),
            on: jest.fn(),
        };
        createAudioPlayer.mockReturnValue(player);
        const resource = {};
        createAudioResource.mockReturnValue(resource);

        await playCommand.execute(message);

        expect(joinVoiceChannel).toHaveBeenCalledWith({
            channelId: 'voiceChannelId',
            guildId: 'guildId',
            adapterCreator: expect.any(Function),
            selfDeaf: false,
        });
        expect(createAudioPlayer).toHaveBeenCalled();
        expect(createAudioResource).toHaveBeenCalledWith('http://example.com/stream');
        expect(player.play).toHaveBeenCalledWith(resource);
        expect(connection.subscribe).toHaveBeenCalledWith(player);
        expect(player.on).toHaveBeenCalledWith(AudioPlayerStatus.Idle, expect.any(Function));
        expect(message.reply).toHaveBeenCalledWith("🎶 The stream is now playing!");
    });

    it('should request to speak if in a Stage Channel', async () => {
        message.member.voice.channel.type = 13; // Stage Channel
        checkStreamOnline.mockResolvedValue(true);
        const connection = {
            subscribe: jest.fn(),
            destroy: jest.fn(),
        };
        joinVoiceChannel.mockReturnValue(connection);
        const player = {
            play: jest.fn(),
            on: jest.fn(),
        };
        createAudioPlayer.mockReturnValue(player);
        const resource = {};
        createAudioResource.mockReturnValue(resource);

        await playCommand.execute(message);

        expect(message.guild.members.me.voice.setSuppressed).toHaveBeenCalledWith(false);
        expect(message.reply).toHaveBeenCalledWith("🎶 The stream is now playing!");
    });
});