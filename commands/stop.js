const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('⛔ Stop the music and make the bot leave the voice channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), // Admin only
  async execute(interaction) {
    const guild = interaction.guild;
    const member = guild.members.me;

    if (!member.voice.channel) {
      return interaction.reply({ content: "❌ I'm not connected to any voice channel.", ephemeral: true });
    }

    try {
      const channelName = member.voice.channel.name;
      member.voice.disconnect();

      const embed = new EmbedBuilder()
        .setColor(0xff5555)
        .setTitle('🛑 Disconnected')
        .setDescription(`Left the voice channel **${channelName}**.`)
        .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });

    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "⚠️ Something went wrong while trying to leave the voice channel.",
        ephemeral: true
      });
    }
  }
};
