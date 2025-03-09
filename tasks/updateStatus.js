const axios = require('axios'); 
const { JSON_URL } = require('../config'); // Assurez-vous d'importer l'URL du JSON à partir de la config

module.exports = {
  name: 'updateStatus',
  description: 'Mise à jour du statut du bot',
  async execute(client) {
    try {
      const { data } = await axios.get(JSON_URL);
      // Utilisation de l'opérateur de propagation pour éviter les erreurs si les données sont manquantes
      const currentSong = data?.icestats?.source?.title || "No song available"; 

      // Mise à jour du statut du bot
      await client.user.setActivity(`🎧 ${currentSong}`, { type: 'LISTENING' });
      console.log(`Updated status: ${currentSong}`);
    } catch (error) {
      console.error('Error updating status:', error);

      // Mise à jour du statut par défaut en cas d'erreur
      await client.user.setActivity('Soundshine Radio', { type: 'LISTENING' });
    }
  },
};

// Mettre à jour le statut toutes les 60 secondes (60000ms)
setInterval(() => {
  module.exports.execute(client); // Appeler la fonction pour mettre à jour le statut
}, 25000);
