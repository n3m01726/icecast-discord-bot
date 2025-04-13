const path = require('path');
const fs = require('fs');

const env = process.env.NODE_ENV || 'dev';
const configPath = path.join(__dirname, `${env}.json`);

if (!fs.existsSync(configPath)) {
  throw new Error(`No config found for environment: ${env}`);
}

const config = require(configPath);

module.exports = config;
