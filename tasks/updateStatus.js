const axios = require('axios');
const { JSON_URL } = require('../config'); // Assurez-vous que l'URL est bien définie dans la config

module.exports = {
  name: 'updateStatus',
  description: 'Mise à jour du statut du bot',
  async execute(client) {
    // Vérifie que le bot est prêt avant d'essayer de mettre à jour le statut
    if (!client.user) {
      console.error('Le client n\'est pas prêt !');
      return;
    }

    try {
      // Vérification de l'URL avant de procéder
      if (!JSON_URL) {
        console.error('L\'URL du JSON (JSON_URL) n\'est pas définie dans la config.');
        return;
      }

      // Effectuer la requête pour obtenir les informations du stream
      const { data } = await axios.get(JSON_URL);

      // Assurer qu'on a bien une chanson à afficher
      const currentSong = data.icestats?.source?.title || "No song available";

      // Log pour vérifier la chanson
      console.log(`Chanson actuelle : ${currentSong}`);

      // Mise à jour du statut
      await client.user.setActivity(`🎧 ${currentSong}`, { type: 'LISTENING' });
      console.log(`Statut mis à jour : ${currentSong}`);
    } catch (error) {
      // En cas d'erreur, log et fallback à un statut par défaut
      console.error('Erreur lors de la mise à jour du statut :', error.message);
      await client.user.setActivity('Soundshine Radio', { type: 'LISTENING' });
      console.log('Statut de secours : Soundshine Radio');
    }
  },
};
