const axios = require('axios');
const { JSON_URL } = process.env.JSON_URL;

async function checkStreamOnline() {
    try {
        const response = await axios.get(JSON_URL);
        const data = response.data;

        return data?.icestats?.source?.title !== "";
    } catch (error) {
        console.error("Error checking stream status: ", error);
        return false;
    }
}

module.exports = { checkStreamOnline };