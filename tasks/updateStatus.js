const axios = require('axios');
const { JSON_URL } = require('../config'); // Assurez-vous d'importer l'URL du JSON à partir de la config

module.exports = {
  name: 'updateStatus',
  description: 'Mise à jour du statut du bot',
  async execute(client) {
    try {
      // Effectuer la requête pour obtenir les informations du stream
      const { data } = await axios.get(JSON_URL);
      const currentSong = data.icestats.source.title || "No song available";

      // Log pour vérifier la chanson
      console.log('Current Song:', currentSong);

      // Mise à jour du statut
      bot.user.setActivity("🎧 ${currentSong}", {type: 2});
      console.log(`Updated status to: ${currentSong}`);
    } catch (error) {
      console.error('Error updating status:', error);
      bot.user.setActivity("Soundshine Radio", {type: 2});
      console.log('Fallback activity set to Soundshine Radio');
    }
  },
};
