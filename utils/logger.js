// utils/logger.js
const winston = require('winston');
const chalk = require('chalk');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/bot.log' }),
  ],
});

// Custom helpers
logger.success = (msg) => console.log(chalk.green(`[✔] ${msg}`));
logger.warn = (msg) => console.log(chalk.yellow(`[⚠] ${msg}`));
logger.error = (msg) => console.error(chalk.red(`[✖] ${msg}`));
logger.custom = (prefix, msg, color = 'blue') => {
  const colorFn = chalk[color] || chalk.white;
  console.log(colorFn(`[${prefix}] ${msg}`));
};

// Fonction pour afficher les titres de section avec des séparateurs
logger.section = (sectionName) => {
  console.log(chalk.blue(`\n--- Chargement des ${sectionName} ---`));
};

module.exports = logger;
