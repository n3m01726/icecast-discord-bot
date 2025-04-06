const logger = require('../utils/logger');
module.exports = {
    name: 'ready',
    once: true,
    execute() {
        logger.success('🤖 Bot connecté avec succès.')
    },
};
