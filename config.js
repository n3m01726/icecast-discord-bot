require('dotenv').config();  // Si tu utilises dotenv
module.exports = {
    BOT_TOKEN: process.env.BOT_TOKEN,
    UNSPLASH_ACCESS_KEY: process.env.UNSPLASH_API,
    VOICE_CHANNEL_ID: process.env.VOICE_CHANNEL_ID,
    ADMINBOT_CHANNEL_ID: process.env.ADMINBOT_CHANNEL_ID,
    ADMIN_ROLE_ID: process.env.ADMIN_ROLE_ID,
    ANNOUNCEMENTS_CHANNEL_ID: process.env.ANNOUNCEMENTS_CHANNEL_ID,
    PREFIX: '!s',
    STREAM_URL: "https://stream.soundshineradio.com:8445/stream",
    JSON_URL: "https://stream.soundshineradio.com:8445/status-json.xsl",
    BOT_ROLE_NAME: "soundSHINE Radio",
};
