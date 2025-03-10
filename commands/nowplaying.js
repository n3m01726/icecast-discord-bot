const axios = require('axios');
const JSON_URL = "https://stream.soundshineradio.com:8445/status-json.xsl";

// Fonction pour corriger les accents et apostrophes
const fixEncoding = (str) => {
  return str
    .replace(/Ã©/g, 'é')  // Corrige le 'é'
    .replace(/Ã‰/g, 'É')  // Corrige le 'É'
    .replace(/Ã /g, 'à')   // Corrige le 'à'
    .replace(/Ã§/g, 'ç')   // Corrige le 'ç'
    .replace(/Ã¨/g, 'è')   // Corrige le 'è'
    .replace(/Ãª/g, 'ê')   // Corrige le 'ê'
    .replace(/Ã /g, 'â')   // Corrige le 'â'
    .replace(/â€™/g, '’')   // Corrige l’apostrophe
    .replace(/â€™/g, '‘')   // Corrige l’autre apostrophe
    .replace(/Iâm/g, "I'm") // Corrige l'apostrophe sur 'I'm'
    .replace(/Ã®/g, 'î')   // Corrige le 'î'
    .replace(/Ã¶/g, 'ö')   // Corrige le 'ö'
    .replace(/Ã¼/g, 'ü')   // Corrige le 'ü'
    .replace(/â€œ/g, '"')   // Corrige les guillemets ouvrants
    .replace(/â€/g, '"') // Corrige les guillemets fermants
    .replace(/â/g, "'");   // Corrige les apostrophes
};

module.exports = {
  name: 'np',
  description: 'Displays the currently playing song',
  async execute(message) {
    try {
      const response = await axios.get(JSON_URL, {
        responseType: 'text', // Forcer la réponse en texte
        headers: {
          'Accept-Charset': 'UTF-8',
        },
      });

      const data = response.data;
      
      // Récupère le titre de la chanson
      const currentSong = fixEncoding(data?.icestats?.source?.title || "No song information available");
      
      // Répond avec la chanson en cours
      message.reply(`🎶 Now playing: **${currentSong}**`);
    } catch (error) {
      console.error("Error fetching current song: ", error);
      message.reply("Unable to fetch current song.");
    }
  },
};
