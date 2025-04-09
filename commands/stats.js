const axios = require('axios');
const { ADMIN_ROLE_ID, JSON_URL } = require('../config'); // Importer les informations nécessaires
const logger = require('../utils/logger'); // Assurez-vous d'avoir un logger configuré

module.exports = {
    name: 'stats',
    description: 'Affiche les statistiques du stream',
    async execute(message, args) {
        // Vérifie si l'utilisateur a le rôle admin
        if (!message.member.roles.cache.has(ADMIN_ROLE_ID)) {
            return message.reply("Vous devez être administrateur pour exécuter cette commande.");
        }

        try {
            const { data } = await axios.get(JSON_URL);
            const listeners = data.icestats.source.listeners || 'N/A';
            const bitrate = data.icestats.source.bitrate || 'N/A';

            const statsMessage = `**Stream Stats**:\n Current listeners: ${listeners}\n Bitrate: ${bitrate} kbps`;
            message.channel.send(statsMessage);
        } catch (error) {
            logger.error('Error fetching stream stats:', error);
            message.reply("Impossible de récupérer les statistiques du stream.");
        }
    },
};
