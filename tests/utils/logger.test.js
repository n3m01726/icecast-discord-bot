const logger = require('../../utils/logger');
const fs = require('fs');
const path = require('path');

describe('Logger', () => {
    const logFilePath = path.join(__dirname, 'logs', 'bot.log');

    beforeEach(() => {
        if (fs.existsSync(logFilePath)) {
            fs.unlinkSync(logFilePath);
        }
    });

    afterAll(() => {
        if (fs.existsSync(logFilePath)) {
            fs.unlinkSync(logFilePath);
        }
    });

    test('should log info messages to console and file', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        logger.info('Test info message');

        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Test info message'));
        consoleSpy.mockRestore();

        const logFileContent = fs.readFileSync(logFilePath, 'utf8');
        expect(logFileContent).toContain('Test info message');
    });

    test('should log error messages to console and file', () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        logger.error('Test error message');

        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Test error message'));
        consoleSpy.mockRestore();

        const logFileContent = fs.readFileSync(logFilePath, 'utf8');
        expect(logFileContent).toContain('Test error message');
    });
});