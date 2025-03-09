const { getVoiceConnection } = require('@discordjs/voice');
const { ADMIN_ROLE_ID } = require('../config'); // Importer l'ID du rôle admin

module.exports = {
    name: 'stop',
    description: 'Arrête le stream et déconnecte le bot du salon vocal',
    async execute(message) {
        // Vérifie si l'utilisateur est admin
        if (!message.member.roles.cache.has(ADMIN_ROLE_ID)) {
            return message.reply("Cette commande est réservée aux administrateurs.");
        }

        // Récupérer la connexion vocale actuelle du bot
        const connection = getVoiceConnection(message.guild.id);

        if (connection) {
            connection.destroy(); // Déconnecte le bot
            return message.reply("Le stream a été arrêté et le bot a quitté le salon vocal.");
        } else {
            return message.reply("Le bot n'est pas connecté à un salon vocal.");
        }
    },
};
