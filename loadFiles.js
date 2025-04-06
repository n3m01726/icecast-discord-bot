const fs = require('fs');
const path = require('path');
const logger = require('./utils/logger');

const loadFiles = async (folderName, type, client) => {
  const basePath = path.join(__dirname, folderName);

  if (!fs.existsSync(basePath)) {
    logger.warn(`Dossier ${folderName} introuvable.`);
    return;
  }

  const files = fs.readdirSync(basePath).filter(file => {
    // Exclure les fichiers de utils seulement pour les 'tasks'
    if (folderName === 'utils' && type === 'task') return false;
    return file.endsWith('.js');
  });

  if (files.length > 0) {
    logger.section(type === 'command' ? 'commands' : type === 'event' ? 'events' : type === 'task' ? 'tasks' : 'utils');
  }

  for (const file of files) {
    const filePath = path.join(basePath, file);
    try {
      // Commenter ou supprimer cette ligne pour ne plus voir l'info de chargement du fichier
      // logger.info(`Chargement du fichier: ${file}`);

      const fileModule = require(filePath);

      switch (type) {
        case 'command':
          if (fileModule.name && typeof fileModule.execute === 'function') {
            client.commands.set(fileModule.name, fileModule);
            logger.success(`Commande chargée: ${fileModule.name}`);
          } else {
            logger.warn(`Commande invalide dans ${file}. Vérifie que 'name' et 'execute' existent et sont corrects.`);
          }
          break;

        case 'event':
          if (fileModule.name && typeof fileModule.execute === 'function') {
            const handler = (...args) => fileModule.execute(...args, client);
            if (fileModule.once) {
              client.once(fileModule.name, handler);
            } else {
              client.on(fileModule.name, handler);
            }
            logger.success(`Événement chargé: ${fileModule.name}`);
          } else {
            logger.warn(`Événement invalide dans ${file}. Vérifie que 'name' et 'execute' existent et sont corrects.`);
          }
          break;

        case 'task':
          if (fileModule.name && typeof fileModule.execute === 'function') {
            if (fileModule.interval) {
              setInterval(() => fileModule.execute(client), fileModule.interval);
            } else {
              fileModule.execute(client);
            }
            logger.success(`Tâche chargée: ${fileModule.name}`);
          } else {
            logger.warn(`Tâche invalide dans ${file}. Vérifie que 'name' et 'execute' existent et que 'interval' est correct.`);
          }
          break;

        case 'util':
          logger.custom('UTIL', `Fichier utilitaire chargé: ${file}`, 'gray');
          break;

        default:
          logger.warn(`Type non reconnu pour ${file}: ${type}`);
          break;
      }
    } catch (err) {
      logger.error(`Erreur lors du chargement du fichier ${file}: ${err.message}`);
    }
  }
};

module.exports = loadFiles;
