const logger = require('../utils/logger'); // Assurez-vous d'avoir un logger configuré

module.exports = {
    name: 'messageCreate',
    execute(message) {
        logger.info('messageCreate event triggered'); // Log pour vérifier si l'événement est déclenché

        // Vérifie si le message est défini et s'il provient d'un bot, pour éviter de répondre au bot lui-même
        if (!message || !message.author || message.author.bot) return;
        if (message.mentions.has(message.client.user)) return;

        // Vérifie si le message commence par le préfixe défini
        const prefix = message.client.config.PREFIX;
        if (!message.content.startsWith(prefix)) return;

        logger.info(`Message avec préfixe détecté: ${message.content}`); // Log pour vérifier le message avec préfixe

        // Sépare la commande et les arguments
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        logger.info(`Commande détectée: ${commandName}`); // Log pour vérifier la commande détectée

        // Récupère la commande depuis la collection des commandes
        const command = message.client.commands.get(commandName);

        // Si la commande n'existe pas, ne rien faire
        if (!command) {
            logger.warn(`Commande non trouvée: ${commandName}`); // Log pour commande non trouvée
            return;
        }

        try {
            // Exécute la commande
            command.execute(message, args);
            logger.success(`Commande exécutée: ${commandName}`); // Log pour commande exécutée
        } catch (error) {
            logger.error(error);
            message.reply('Il y a eu une erreur en essayant d\'exécuter cette commande!');
        }
    },
};



