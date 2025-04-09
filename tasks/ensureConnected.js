const { VOICE_CHANNEL_ID } = require('../config');
const { joinVoiceChannel } = require('@discordjs/voice');
const logger = require('../utils/logger'); // Assurez-vous d'avoir un logger configuré

async function ensureConnected(bot) {
    const voiceChannel = bot.channels.cache.get(VOICE_CHANNEL_ID);
    if (!voiceChannel) {
        logger.warn('Le canal vocal spécifié est introuvable.');
        return;
    }

    // Vérifiez si bot.voice et bot.voice.connections sont définis
    if (voiceChannel && (!bot.voice || !bot.voice.connections || !bot.voice.connections.size)) {
        try {
            joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            });
            console.log(`Connecté au canal vocal: ${voiceChannel.name}`);
        } catch (error) {
            logger.error('Erreur lors de la connexion au canal vocal:', error);
        }
    }
}

module.exports = {
    name: 'ensureConnected',
    interval: 60000, // Intervalle en millisecondes (60 secondes)
    execute: ensureConnected
};
