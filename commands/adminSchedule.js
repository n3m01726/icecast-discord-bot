const { SlashCommandBuilder } = require('discord.js');
const { ADMIN_ROLE_ID } = require('../config');
const { addOrUpdateSchedule } = require('../utils/database'); // Assurez-vous que le chemin est correct

module.exports = {
  data: new SlashCommandBuilder()
    .setName('adminschedule')
    .setDescription('📝 Ajoute ou met à jour le programme du stream pour un jour spécifique')
    .addStringOption(option =>
      option.setName('jour')
        .setDescription('Jour de la semaine (lundi, mardi, etc.)')
        .setRequired(true)
        .addChoices(
          { name: 'Lundi', value: 'lundi' },
          { name: 'Mardi', value: 'mardi' },
          { name: 'Mercredi', value: 'mercredi' },
          { name: 'Jeudi', value: 'jeudi' },
          { name: 'Vendredi', value: 'vendredi' },
          { name: 'Samedi', value: 'samedi' },
          { name: 'Dimanche', value: 'dimanche' }
        )
    )
    .addStringOption(option =>
      option.setName('programmes')
        .setDescription('Programme pour le jour sous forme "Titre1 à Heure1, Titre2 à Heure2"')
        .setRequired(true)
    ),
  
  async execute(interaction) {
    // Vérification des permissions d'administrateur
    if (!interaction.member.roles.cache.has(ADMIN_ROLE_ID)) {
      return interaction.reply("Vous devez être administrateur pour exécuter cette commande.");
    }

    const jour = interaction.options.getString('jour');
    const programmes = interaction.options.getString('programmes').split(',').map(p => {
      const [title, time] = p.split('à').map(str => str.trim());
      return { title, time };
    });

    try {
      const updatedSchedule = await addOrUpdateSchedule(jour, programmes);
      interaction.reply(`Le programme pour ${jour} a été mis à jour :\n${programmes.map(p => `**${p.title}** à ${p.time}`).join('\n')}`);
    } catch (err) {
      interaction.reply("Une erreur s'est produite lors de la mise à jour du programme.");
    }
  },
};
