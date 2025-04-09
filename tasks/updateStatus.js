const axios = require('axios');
const { JSON_URL } = require('../config');
const { ActivityType } = require('discord.js');
const logger = require('../utils/logger'); // Assurez-vous d'avoir un logger configuré

async function updateStatus(client) {
  try {
    const { data } = await axios.get(JSON_URL, { timeout: 10000 });

    let currentSong = "Stream offline or no song information available";
    if (data.icestats && data.icestats.source) {
      currentSong = data.icestats.source.title || "No title available";
    }

    await client.user.setActivity({ name: `📀 ${currentSong}`, type: ActivityType.Custom, url: 'https://soundshineradio.com' });
    logger.info(`Updated status to: ${currentSong}`);
  } catch (error) {
    logger.error('Error fetching metadata or updating status:', error);
    await client.user.setActivity("Soundshine Radio", { type: 'LISTENING' });
    logger.info('Fallback activity set to Soundshine Radio');
  }
}

module.exports = {
  name: 'updateStatus',
  interval: 25000, // Intervalle en millisecondes (60 secondes)
  execute: updateStatus
};