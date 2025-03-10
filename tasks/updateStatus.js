const axios = require('axios');
const { JSON_URL } = require('../config');
const { ActivityType } = require('discord.js');

async function updateStatus(client) {
  try {
    const { data } = await axios.get(JSON_URL, { timeout: 10000 });

    let currentSong = "Stream offline or no song information available";
    if (data.icestats && data.icestats.source) {
      currentSong = data.icestats.source.title || "No title available";
    }

    console.log('Current Song:', currentSong);
    await client.user.setActivity({ name: `📀 ${currentSong}`, type: ActivityType.Custom, url: 'https://soundshineradio.com' });
    console.log(`Updated status to: ${currentSong}`);
  } catch (error) {
    console.error('Error fetching metadata or updating status:', error);
    await client.user.setActivity("Soundshine Radio", { type: 'LISTENING' });
    console.log('Fallback activity set to Soundshine Radio');
  }
}

module.exports = {
  name: 'updateStatus',
  interval: 25000, // Intervalle en millisecondes (60 secondes)
  execute: updateStatus
};