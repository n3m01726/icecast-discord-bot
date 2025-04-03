const axios = require('axios');
const JSON_URL = "https://stream.soundshineradio.com:8445/status-json.xsl";

module.exports = {
  name: 'np',
  description: 'Displays the currently playing song',
  async execute(message) {
    try {
      const response = await axios.get(JSON_URL);
      const data = response.data;
      const currentSong = data?.icestats?.source?.title || "No song information available";

      message.reply(`🎶 Présentement | 🎶 Now playing: **${currentSong}**`);
    } catch (error) {
      console.error("Error fetching current song: ", error);
      message.reply("Unable to fetch current song.");
    }
  },
};
