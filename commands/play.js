const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { checkStreamOnline } = require('../utils/checkStreamOnline');
const { STREAM_URL } = "https://stream.soundshineradio.com:8445/stream";
module.exports = {
    name: 'play',
    description: 'Play the stream in the voice channel (including Stage Channels)',
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
            selfDeaf: false, // Ne pas se rendre sourd pour pouvoir écouter le stage
        });

        // Vérifier si c'est un Stage Channel et demander la parole
        if (voiceChannel.type === 13) { // Type 13 = Stage Channel
            try {
                await message.guild.members.me.voice.setSuppressed(false);
                console.log("✅ Request to Speak sent!");
            } catch (error) {
                console.warn("⚠️ Unable to request to speak. The bot might not have the necessary permissions.");
            }
        }

        // Play the stream
        const player = createAudioPlayer();
        const resource = createAudioResource(STREAM_URL);
        player.play(resource);

        connection.subscribe(player);

        player.on(AudioPlayerStatus.Idle, () => {
            console.log("Stream ended, disconnecting...");
            connection.destroy();
        });

        return message.reply("🎶 The stream is now playing!");
    },
};
