const axios = require('axios');
const { JSON_URL } = require('../config');
const logger = require('../utils/logger'); // Assurez-vous d'avoir un logger configuré

module.exports = {
  name: 'np',
  description: 'Displays the currently playing song',
  async execute(message) {
    try {
      const response = await axios.get(JSON_URL);
      const data = response.data;
      const currentSong = data?.icestats?.source?.title || "No song information available";

      message.reply(`🎶 Now playing: **${currentSong}**`);
    } catch (error) {
      logger.error("Error fetching current song: ");
      console.log("");
      logger.error(error);
      message.reply("Unable to fetch current song.");
    }
  },
};
