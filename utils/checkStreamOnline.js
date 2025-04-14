const axios = require('axios');
const JSON_URL = "https://stream.soundshineradio.com:8445/status-json.xsl";
const logger = require('../utils/logger'); // Assurez-vous d'avoir un logger configuré

async function checkStreamOnline() {
    try {
        const response = await axios.get(JSON_URL);
        const data = response.data;

        return data?.icestats?.source?.title !== ";
    } catch (error) {
        logger.error("Error checking stream status: ", error);
        return false;
    }
}

module.exports = { checkStreamOnline };