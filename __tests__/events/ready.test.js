const readyEvent = require('../../events/ready');

describe('ready event', () => {
    test('should have the correct name', () => {
        expect(readyEvent.name).toBe('ready');
    });

    test('should be set to execute only once', () => {
        expect(readyEvent.once).toBe(true);
    });

    test('should log "Bot is online and ready!" when executed', () => {
        console.log = jest.fn(); // Mock console.log
        readyEvent.execute();
        expect(console.log).toHaveBeenCalledWith('Bot is online and ready!');
    });
});