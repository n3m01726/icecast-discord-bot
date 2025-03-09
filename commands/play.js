const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { checkStreamOnline } = require('../utils/checkStreamOnline');
const STREAM_URL = "https://stream.soundshineradio.com:8445/stream";

module.exports = {
    name: 'play',
    description: 'Play the stream in the voice channel',
    async execute(message) {
        const member = message.member;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel) {
            return message.reply("You must join a voice channel first!");
        }

        const isStreamOnline = await checkStreamOnline();
        if (!isStreamOnline) {
            return message.reply("❌ The stream is offline, please try again later.");
        }

        // Connect to the voice channel
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
        });

        // Play the stream
        const player = createAudioPlayer();
        const resource = createAudioResource(STREAM_URL);
        player.play(resource);

        connection.subscribe(player);

        player.on(AudioPlayerStatus.Idle, () => connection.destroy()); // Disconnect after the stream ends

        return message.reply("The stream is now playing!");
    },
};
