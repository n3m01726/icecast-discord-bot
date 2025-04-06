const logger = require('../../utils/logger');
const chalk = require('chalk');

// utils/logger.test.js

describe('Logger Utility', () => {
    let consoleSpy;

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('should log success messages with green color', () => {
        const message = 'Success message';
        logger.success(message);
        expect(consoleSpy).toHaveBeenCalledWith(chalk.green(`[✔] ${message}`));
    });

    test('should log warning messages with yellow color', () => {
        const message = 'Warning message';
        logger.warn(message);
        expect(consoleSpy).toHaveBeenCalledWith(chalk.yellow(`[⚠] ${message}`));
    });

    test('should log error messages with red color', () => {
        const message = 'Error message';
        logger.error(message);
        expect(console.error).toHaveBeenCalledWith(chalk.red(`[✖] ${message}`));
    });

    test('should log custom messages with specified color', () => {
        const prefix = 'CUSTOM';
        const message = 'Custom message';
        const color = 'blue';
        logger.custom(prefix, message, color);
        expect(consoleSpy).toHaveBeenCalledWith(chalk[color](`[${prefix}] ${message}`));
    });

    test('should log custom messages with default color if color is invalid', () => {
        const prefix = 'CUSTOM';
        const message = 'Custom message';
        const invalidColor = 'invalidColor';
        logger.custom(prefix, message, invalidColor);
        expect(consoleSpy).toHaveBeenCalledWith(chalk.white(`[${prefix}] ${message}`));
    });

    test('should log section titles with blue color', () => {
        const sectionName = 'Test Section';
        logger.section(sectionName);
        expect(consoleSpy).toHaveBeenCalledWith(chalk.blue(`\n--- Chargement des ${sectionName} ---`));
    });
});