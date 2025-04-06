const fs = require('fs');
const path = require('path');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'schedule',
    description: 'Displays the current schedule of programs',
    async execute(message) {
        try {
            const schedulePath = path.join(__dirname, '..', 'schedule.txt');
            const scheduleContent = fs.readFileSync(schedulePath, 'utf-8');

            const sections = scheduleContent.split("🗓");
            const enRaw = sections[1]?.trim() || "No data available.";
            const frRaw = sections[2]?.trim() || "Aucune donnée disponible.";

            // Enlève la première ligne (le titre interne)
            const enSchedule = enRaw.split('\n').slice(1).join('\n').trim();
            const frSchedule = frRaw.split('\n').slice(1).join('\n').trim();

            const embed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle('📋 Choisissez une langue / Choose a language')
                .setDescription('Cliquez sur un des boutons ci-dessous pour voir l\'horaire.');

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('schedule_fr')
                    .setLabel('Français')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('schedule_en')
                    .setLabel('English')
                    .setStyle(ButtonStyle.Secondary)
            );

            await message.reply({ embeds: [embed], components: [row] });

            // Interaction collector (à déplacer dans un fichier events si tu veux centraliser)
            const collector = message.channel.createMessageComponentCollector({
                filter: interaction => interaction.user.id === message.author.id,
                time: 15_000
            });

            collector.on('collect', async interaction => {
                if (interaction.customId === 'schedule_fr') {
                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(0xf1c40f)
                                .setTitle('**Horaire (Version Française)**')
                                .setDescription(frSchedule)
                        ],
                        components: []
                    });
                } else if (interaction.customId === 'schedule_en') {
                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(0x2ecc71)
                                .setTitle('**Schedule (English version)**')
                                .setDescription(enSchedule)
                        ],
                        components: []
                    });
                }
            });

        } catch (error) {
            console.error("Error reading schedule: ", error);
            message.reply("Unable to fetch the schedule.");
        }
    },
};
