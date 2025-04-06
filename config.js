require('dotenv').config();  // Si tu utilises dotenv
module.exports = {

    // Discord Token and informations
BOT_TOKEN: process.env.BOT_TOKEN,
BOT_ROLE_NAME: "soundSHINE Radio",
VOICE_CHANNEL_ID: process.env.VOICE_CHANNEL_ID,
ANNOUNCEMENTS_CHANNEL_ID: process.env.ANNOUNCEMENTS_CHANNEL_ID,
PREFIX: '!s',

// Unsplash API
UNSPLASH_ACCESS_KEY: process.env.UNSPLASH_API,

// Icecast API URLS
STREAM_URL: "https://stream.soundshineradio.com:8445/stream",
JSON_URL: "https://stream.soundshineradio.com:8445/status-json.xsl"    

};

