const axios = require('axios');
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_API;
module.exports = {
  name: 'getwall',
  description: 'Fetches a random photo from Unsplash',
  async execute(message) {
    try {
      const response = await axios.get(`https://api.unsplash.com/photos/random?client_id=${UNSPLASH_ACCESS_KEY}&count=1`);
      const photoUrl = response.data[0]?.urls?.regular;

      if (photoUrl) {
        message.reply(photoUrl);
      } else {
        message.reply("Couldn't fetch a photo, try again later.");
      }
    } catch (error) {
      console.error("Error fetching photo from Unsplash: ", error);
      message.reply("Unable to fetch a random photo.");
    }
  },
};
