const axios = require('axios');
const JSON_URL = require('../config');


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
      console.log("Error fetching current song:", error?.message || error);
      message.reply("Unable to fetch current song.");
    }
  },
};
