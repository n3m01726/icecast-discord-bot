require('dotenv').config();  // Si tu utilises dotenv
module.exports = {
    BOT_TOKEN: process.env.BOT_TOKEN,
    UNSPLASH_ACCESS_KEY: process.env.UNSPLASH_API,
    STREAM_URL: "https://stream.soundshineradio.com:8445/stream",
    JSON_URL: "https://stream.soundshineradio.com:8445/status-json.xsl",
    BOT_ROLE_NAME: "soundSHINE Radio",
    VOICE_CHANNEL_ID: 1324247709502406748,
    ADMINBOT_CHANNEL_ID: 1338181640081510401,
    ADMIN_ROLE_ID: 1292528573881651372,
    ANNOUNCEMENTS_CHANNEL_ID: 1334280886895775794,
    PREFIX: '!s'
  };
