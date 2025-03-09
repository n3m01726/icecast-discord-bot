const { VOICE_CHANNEL_ID } = require('../config'); // Assure-toi que l'ID du salon vocal est bien dans config.js

module.exports = {
  name: 'ensureConnected',
  interval: 30, // en secondes
  async execute(bot) {
    const voiceChannel = await bot.channels.fetch(VOICE_CHANNEL_ID);
    if (voiceChannel && !voiceChannel.guild.voice && !bot.voice.connections.size) {
      await voiceChannel.join();
    }
  },
};
