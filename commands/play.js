const {
    SlashCommandBuilder
  } = require('discord.js');
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
    data: new SlashCommandBuilder()
      .setName('play')
      .setDescription('Play the stream or fallback playlist if offline'),
  
    async execute(interaction) {
      const member = interaction.member;
      const voiceChannel = member.voice.channel;
  
      if (!voiceChannel) {
        return interaction.reply({
          content: '🔇 You must join a voice channel first!',
          ephemeral: true
        });
      }
  
      await interaction.deferReply();
  
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
        selfDeaf: false
      });
  
      // Handle Stage Channels
      if (voiceChannel.type === 13) {
        try {
          await interaction.guild.members.me.voice.setSuppressed(false);
          logger.success('✅ Request to Speak sent!');
        } catch (err) {
          logger.error('⚠️ Unable to request to speak.');
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
        logger.info('🔴 Playing live stream.');
        return interaction.editReply('🎶 Now playing the **live stream**!');
      } else {
        logger.warn('⚠️ Stream offline — switching to fallback playlist...');
        const fallbackDir = path.join(__dirname, '..', 'fallback');
        const mp3Files = fs.readdirSync(fallbackDir).filter(f => f.endsWith('.mp3'));
  
        if (mp3Files.length === 0) {
          connection.destroy();
          return interaction.editReply('❌ Stream is offline and no fallback MP3s found.');
        }
  
        const playNext = async () => {
          const files = fs.readdirSync(fallbackDir).filter(f => f.endsWith('.mp3'));
          const nextFile = path.join(fallbackDir, files[Math.floor(Math.random() * files.length)]);
          const resource = createAudioResource(nextFile);
          player.play(resource);
          connection.subscribe(player);
  
          try {
            const metadata = await mm.parseFile(nextFile, { duration: true });
            const title = metadata.common.title || path.basename(nextFile);
            const artist = metadata.common.artist || 'Unknown Artist';
            await interaction.followUp(`🎵 Now playing: **${title}** by *${artist}*`);
          } catch (err) {
            const fallbackTitle = path.basename(nextFile, '.mp3');
            const [artist, title] = fallbackTitle.includes(' - ')
              ? fallbackTitle.split(' - ').map(str => str.trim())
              : ['Unknown Artist', fallbackTitle];
            await interaction.followUp(`🎵 Now playing: **${title}** by *${artist}*`);
          }
  
          player.once(AudioPlayerStatus.Idle, playNext);
        };
  
        await playNext();
        return interaction.editReply('📻 Playing fallback playlist.');
      }
    }
  };
  