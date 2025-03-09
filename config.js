require('dotenv').config();  // Si tu utilises dotenv
module.exports = {
    BOT_TOKEN: process.env.BOT_TOKEN,
    UNSPLASH_ACCESS_KEY: process.env.UNSPLASH_API,
    STREAM_URL: "https://stream.soundshineradio.com:8445/stream",
    JSON_URL: "https://stream.soundshineradio.com:8445/status-json.xsl",
    BOT_ROLE_NAME: "soundSHINE Radio",
    VOICE_CHANNEL_ID: '1333146428876394620', // Assurez-vous que cet ID est correct
    ADMINBOT_CHANNEL_ID: '1333146428465348644', // Assurez-vous que cet ID est correct
    ADMIN_ROLE_ID: '1292528573881651372', // Assurez-vous que cet ID est correct
    ANNOUNCEMENTS_CHANNEL_ID: '1333146428465348642', // Assurez-vous que cet ID est correct
    PREFIX: '!s'
};
