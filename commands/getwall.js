const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger'); // Assurez-vous d'avoir un logger configuré
const { SlashCommandBuilder } = require('discord.js'); // Ajout pour Slash Commands

module.exports = {
  data: new SlashCommandBuilder()
    .setName('getwall')
    .setDescription('Fetches a random photo from Unsplash')
    .addStringOption(option =>
      option.setName('topic')
        .setDescription('Topic for the image (e.g. nature, city, art, etc.)')
        .setRequired(false)
    ),

  async execute(interaction) {
    // Récupérer le topic spécifié par l'utilisateur ou utiliser un défaut
    const topic = interaction.options.getString('topic');
    const url = topic
      ? `https://api.unsplash.com/photos/random?client_id=${config.UNSPLASH_ACCESS_KEY}&query=${topic}&count=1`
      : `https://api.unsplash.com/photos/random?client_id=${config.UNSPLASH_ACCESS_KEY}&count=1`;

    try {
      const response = await axios.get(url);
      const photoUrl = response.data[0]?.urls?.regular;

      if (photoUrl) {
        await interaction.reply(photoUrl); // Envoi de la photo à l'utilisateur qui a exécuté la commande
      } else {
        await interaction.reply("Couldn't fetch a photo, try again later.");
      }
    } catch (error) {
      logger.error("Error fetching photo from Unsplash: ", error);
      await interaction.reply("Unable to fetch a random photo.");
      console.error(error); // Log the error for debugging
    }
  },
};
