const { name, once, execute } = require('../../events/ready');

describe('ready event', () => {
    test('should have correct name', () => {
        expect(name).toBe('ready');
    });

    test('should be executed only once', () => {
        expect(once).toBe(true);
    });

    test('should log "Bot is online and ready!"', () => {
        console.log = jest.fn();
        execute();
        expect(console.log).toHaveBeenCalledWith('Bot is online and ready!');
    });
});