const { SlashCommandBuilder } = require('discord.js');
const { getSchedule } = require('../utils/database'); // Utilisation de la fonction de récupération

module.exports = {
  data: new SlashCommandBuilder()
    .setName('schedule')
    .setDescription('🗓️ Affiche le programme du stream')
    .addStringOption(option =>
      option.setName('jour')
        .setDescription('Le jour de la semaine pour le programme (ex. lundi, mardi, etc.)')
        .setRequired(false)
        .addChoices(
          { name: 'Lundi', value: 'lundi' },
          { name: 'Mardi', value: 'mardi' },
          { name: 'Mercredi', value: 'mercredi' },
          { name: 'Jeudi', value: 'jeudi' },
          { name: 'Vendredi', value: 'vendredi' },
          { name: 'Samedi', value: 'samedi' },
          { name: 'Dimanche', value: 'dimanche' }
        )
    ),
  
  async execute(interaction) {
    const jour = interaction.options.getString('jour') || 'lundi'; // Par défaut, lundi

    try {
      const programs = await getSchedule(jour);
      if (!programs || programs.length === 0) {
        return interaction.reply(`❌ Aucun programme trouvé pour ${jour}.`);
      }

      const scheduleMessage = `**Programme du ${jour.charAt(0).toUpperCase() + jour.slice(1)}**:\n` +
        programs.map((entry, index) => `${index + 1}. **${entry.title}** à ${entry.time}`).join('\n');

      await interaction.reply(scheduleMessage);

    } catch (error) {
      console.error('Erreur lors de la récupération du programme :', error);
      interaction.reply("Impossible de récupérer le programme du stream.");
    }
  },
};
