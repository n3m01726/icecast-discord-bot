const axios = require('axios');
const { JSON_URL } = require('../config'); // Assurez-vous d'importer l'URL du JSON à partir de la config

module.exports = {
  name: 'updateStatus',
  description: 'Mise à jour du statut du bot',
  async execute(bot) {
    try {
      const { data } = await axios.get(JSON_URL);
      const currentSong = data.icestats.source.title || "No song available";

      await bot.user.setActivity(`🎧 ${currentSong}`, { type: 'LISTENING' });
      console.log(`Updated status: ${currentSong}`);
    } catch (error) {
      console.error('Error updating status:', error);
      await bot.user.setActivity('Soundshine Radio', { type: 'LISTENING' });
    }
  },
};