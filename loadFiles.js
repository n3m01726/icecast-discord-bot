const fs = require('fs');
const path = require('path');
const logger = require('./utils/logger');

const loadFiles = async (folderName, type, client) => {
  const basePath = path.join(__dirname, folderName);

  if (!fs.existsSync(basePath)) {
    logger.warn(`Folder  ${folderName} not found.`);
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
            logger.success(`Command loaded: ${fileModule.name}`);
          } else {
            logger.warn(`Invalid command in ${file}. Check that 'name' and 'execute' exist and are correct.`);
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
            logger.success(`Event loaded: ${fileModule.name}`);
          } else {
            logger.warn(`Invalid event in ${file}. Check that 'name' and 'execute' exist and are correct.`);
          }
          break;

        case 'task':
          if (fileModule.name && typeof fileModule.execute === 'function') {
            if (fileModule.interval) {
              setInterval(() => fileModule.execute(client), fileModule.interval);
            } else {
              fileModule.execute(client);
            }
            logger.success(`Task loaded: ${fileModule.name}`);
          } else {
            logger.warn(`Invalid task in ${file}. Check that 'name', 'execute' and 'interval' exist and are correct.`);
          }
          break;

        case 'util':
          logger.custom('UTIL', `file loaded : ${file}`, 'gray');
          break;

        default:
          logger.warn(`Type not recognized for ${file}: ${type}`);
          break;
      }
    } catch (err) {
      logger.error(`Error when loading ${file}: ${err.message}`);
      console.error(err);
    }
  }
};

module.exports = loadFiles;
