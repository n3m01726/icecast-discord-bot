const axios = require('axios');
const { ADMIN_ROLE_ID, JSON_URL, ICECAST_HISTORY_URL } = require('../config'); // Ajouter l'URL de l'historique si disponible
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
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
            // Récupération des statistiques de stream
            const { data } = await axios.get(JSON_URL);
            const listeners = data.icestats.source.listeners || 'N/A';
            const bitrate = data.icestats.source.bitrate || 'N/A';

            // Création du message de statistiques de base
            const statsMessage = `**Stream Stats**:\nCurrent listeners: ${listeners}\nBitrate: ${bitrate} kbps`;

            // Création des boutons
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('show_history')
                    .setLabel('Historique des chansons (5)')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('show_full_stats')
                    .setLabel('Stats complètes Icecast')
                    .setStyle(ButtonStyle.Secondary)
            );

            // Envoi du message avec les boutons
            await message.reply({
                content: statsMessage,
                components: [row]
            });

            // Interaction collector pour écouter les clics des boutons
            const collector = message.channel.createMessageComponentCollector({
                filter: interaction => interaction.user.id === message.author.id,
                time: 15_000 // 15 secondes pour collecter les interactions
            });

            collector.on('collect', async interaction => {
                if (interaction.customId === 'show_history') {
                    // Si l'utilisateur clique sur "Historique des chansons"
                    try {
                        const historyData = await axios.get(ICECAST_HISTORY_URL); // URL à configurer pour récupérer l'historique
                        const history = historyData.data.history.slice(0, 5); // Prenez les 5 dernières chansons
                        const songList = history.map((song, index) => `${index + 1}. **${song.song}** - ${song.artist}`).join('\n');

                        const historyMessage = `**Historique des 5 dernières chansons jouées**:\n${songList}`;
                        await interaction.update({
                            content: historyMessage,
                            components: []
                        });
                    } catch (error) {
                        console.error('Erreur lors de la récupération de l\'historique des chansons :', error);
                        await interaction.update({
                            content: "Impossible de récupérer l'historique des chansons.",
                            components: []
                        });
                    }
                } else if (interaction.customId === 'show_full_stats') {
                    // Si l'utilisateur clique sur "Stats complètes Icecast"
                    try {
                        const fullStats = JSON.stringify(data, null, 2); // Conversion des stats en format lisible
                        const fullStatsMessage = `**Statistiques complètes du stream Icecast** :\n\`\`\`json\n${fullStats}\n\`\`\``;
                        await interaction.update({
                            content: fullStatsMessage,
                            components: []
                        });
                    } catch (error) {
                        console.error('Erreur lors de la récupération des stats complètes du stream :', error);
                        await interaction.update({
                            content: "Impossible de récupérer les statistiques complètes du stream.",
                            components: []
                        });
                    }
                }
            });

        } catch (error) {
            logger.error('Error fetching stream stats:', error);
            message.reply("Impossible de récupérer les statistiques du stream.");
        }
    },
};
