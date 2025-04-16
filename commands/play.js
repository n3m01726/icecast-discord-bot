const { 
    joinVoiceChannel, 
    createAudioPlayer, 
    createAudioResource, 
    AudioPlayerStatus, 
    NoSubscriberBehavior 
} = require('@discordjs/voice');

const { checkStreamOnline } = require('../utils/checkStreamOnline');
const { STREAM_URL } = require('../config');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const mm = require('music-metadata');

module.exports = {
    name: 'play',
    description: 'Play the stream or fallback MP3s in the voice channel',
    async execute(message) {
        const member = message.member;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel) {
            return message.reply("You must join a voice channel first!");
        }

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
            selfDeaf: false
        });

        // Stage Channels — Request to speak
        if (voiceChannel.type === 13) {
            try {
                await message.guild.members.me.voice.setSuppressed(false);
                logger.success("✅ Request to Speak sent!");
            } catch (error) {
                logger.error("⚠️ Unable to request to speak.");
            }
        }

        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play
            }
        });

        const isStreamOnline = await checkStreamOnline();

        if (isStreamOnline) {
            const resource = createAudioResource(STREAM_URL);
            player.play(resource);
            connection.subscribe(player);
            logger.info("🔴 Playing live stream.");
            message.reply("🎶 Now playing the live stream!");
        } else {
            logger.warn("⚠️ Stream is offline, switching to fallback MP3s...");

            const fallbackDir = path.join(__dirname, '..', 'fallback');
            const mp3Files = fs.readdirSync(fallbackDir).filter(file => file.endsWith('.mp3'));

            if (mp3Files.length === 0) {
                message.reply("❌ Stream is offline and no fallback MP3s were found.");
                connection.destroy();
                return;
            }

            // Fonction récursive de lecture
            function playNext(connection, player, message) {
                const fallbackDir = path.join(__dirname, '../fallback');
                const files = fs.readdirSync(fallbackDir).filter(file => file.endsWith('.mp3'));

                if (files.length === 0) {
                    logger.error("❌ No MP3 files found in fallback directory.");
                    return message.channel.send("❌ No fallback music available.");
                }

                const nextFile = path.join(fallbackDir, files[Math.floor(Math.random() * files.length)]);
                const resource = createAudioResource(nextFile);
                player.play(resource);
                connection.subscribe(player);

                (async () => {
                    try {
                        const metadata = await mm.parseFile(nextFile, { duration: true });
                        const title = metadata.common.title;
                        const artist = metadata.common.artist;

                        if (title && artist) {
                            logger.success(`✅ ID3 Metadata: ${artist} - ${title}`);
                            message.channel.send(`🎵 Now playing: **${title}** by *${artist}*`);
                        } else {
                            throw new Error('Incomplete metadata, falling back to filename.');
                        }

                    } catch (err) {
                        logger.warn(`⚠️ Could not read full metadata for ${path.basename(nextFile)} — using filename.`);
                        logger.debug(`Details: ${err.message}`);

                        const filename = path.basename(nextFile, '.mp3');
                        const [artist, title] = filename.includes(' - ')
                            ? filename.split(' - ').map(str => str.trim())
                            : ['Unknown Artist', filename];

                        message.channel.send(`🎵 Now playing: **${title}** by *${artist}*`);
                    }
                })();

                player.once(AudioPlayerStatus.Idle, () => {
                    playNext(connection, player, message); // Répéter la lecture avec le même player
                });
            }

            message.reply("📻 Stream offline — playing fallback playlist.");
            playNext(connection, player, message); // Lancer la lecture de la playlist
        }
    }
};
