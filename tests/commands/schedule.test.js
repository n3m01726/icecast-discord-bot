const fs = require('fs');
const path = require('path');
const { execute } = require('../../commands/schedule');

jest.mock('fs');
jest.mock('path');

describe('schedule command', () => {
    let message;

    beforeEach(() => {
        message = {
            reply: jest.fn(),
        };
        path.join.mockReturnValue('/fake/path/schedule.txt');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should reply with the schedule when file is read successfully', async () => {
        const scheduleContent = "🗓\nEnglish Schedule Content\n🗓\nFrench Schedule Content";
        fs.readFileSync.mockReturnValue(scheduleContent);

        await execute(message);

        expect(fs.readFileSync).toHaveBeenCalledWith('/fake/path/schedule.txt', 'utf-8');
        expect(message.reply).toHaveBeenCalledWith({
            embeds: [{
                title: "📅 Schedule",
                description: "**English Schedule:**\nEnglish Schedule Content\n\n**Horaire Français:**\nFrench Schedule Content",
                color: 0x3498db,
            }],
        });
    });

    test('should reply with default message when schedule sections are missing', async () => {
        const scheduleContent = "🗓";
        fs.readFileSync.mockReturnValue(scheduleContent);

        await execute(message);

        expect(fs.readFileSync).toHaveBeenCalledWith('/fake/path/schedule.txt', 'utf-8');
        expect(message.reply).toHaveBeenCalledWith({
            embeds: [{
                title: "📅 Schedule",
                description: "**English Schedule:**\nNo data available.\n\n**Horaire Français:**\nAucune donnée disponible.",
                color: 0x3498db,
            }],
        });
    });

    test('should reply with an error message when file reading fails', async () => {
        fs.readFileSync.mockImplementation(() => {
            throw new Error('File read error');
        });

        await execute(message);

        expect(fs.readFileSync).toHaveBeenCalledWith('/fake/path/schedule.txt', 'utf-8');
        expect(message.reply).toHaveBeenCalledWith("Unable to fetch the schedule.");
    });
});