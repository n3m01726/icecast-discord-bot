const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { JSON_URL } = require('../config');
const logger = require('../utils/logger'); // Assurez-vous d'avoir un logger configuré

module.exports = {
  data: new SlashCommandBuilder()
    .setName('np')
    .setDescription('🎶 Displays the currently playing song'),
  
  async execute(interaction) {
    try {
      const response = await axios.get(JSON_URL);
      const data = response.data;
      const currentSong = data?.icestats?.source?.title || "No song information available";
      
      // Embed visuel
      const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle('Now Playing')
        .setDescription(`🎶 **${currentSong}**`)
        .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });

    } catch (error) {
      logger.error("Error fetching current song: ");
      logger.error(error);

      await interaction.reply({
        content: "⚠️ Unable to fetch current song.",
        ephemeral: true
      });
    }
  },
};
