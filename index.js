// index.js
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { BOT_TOKEN, PREFIX } = require('./config');
const loadFiles = require('./loadFiles');
const logger = require('./utils/logger');
const { setupWebhookServer } = require('./utils/webhook'); // Importer la fonction pour démarrer le serveur webhook
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.commands = new Collection();
client.config = { PREFIX };

logger.success(`Préfixe configuré: ${PREFIX}`);

(async () => {
  try {
    // Chargement centralisé des fichiers
    await loadFiles('commands', 'command', client);
    await loadFiles('events', 'event', client);
    await loadFiles('tasks', 'task', client);
    await loadFiles('utils', 'util', client);

    logger.success('✅ Tous les modules ont été chargés avec succès.');
  } catch (err) {
    logger.error(`Erreur au chargement des fichiers: ${err.message}`);
    process.exit(1);  // Quitte le processus en cas d'erreur critique
  }

  // Connexion au bot
  client.login(BOT_TOKEN)
    .then(() => logger.success('🤖 Bot connecté avec succès.'))
    .catch((err) => logger.error(`Erreur lors de la connexion du bot: ${err.message}`));
})();
    // Démarrer le serveur webhook après que le bot soit prêt
    setupWebhookServer(client);