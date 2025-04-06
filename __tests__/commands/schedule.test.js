const fs = require('fs');
const path = require('path');
const scheduleCommand = require('../../commands/schedule');

jest.mock('fs');
jest.mock('path');

describe('schedule command', () => {
    let message;

    beforeEach(() => {
        message = {
            reply: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should reply with the schedule when the file is read successfully', async () => {
        const mockScheduleContent = "🗓\nEnglish Schedule Content\n🗓\nFrench Schedule Content";
        const mockSchedulePath = '/mock/path/schedule.txt';

        path.join.mockReturnValue(mockSchedulePath);
        fs.readFileSync.mockReturnValue(mockScheduleContent);

        await scheduleCommand.execute(message);

        expect(path.join).toHaveBeenCalledWith(__dirname, '..', 'schedule.txt');
        expect(fs.readFileSync).toHaveBeenCalledWith(mockSchedulePath, 'utf-8');
        expect(message.reply).toHaveBeenCalledWith({
            embeds: [
                {
                    title: "📅 Schedule",
                    description: `**English Schedule:**\nEnglish Schedule Content\n\n**Horaire Français:**\nFrench Schedule Content`,
                    color: 0x3498db,
                },
            ],
        });
    });

    it('should reply with default messages when the schedule file is empty', async () => {
        const mockScheduleContent = "";
        const mockSchedulePath = '/mock/path/schedule.txt';

        path.join.mockReturnValue(mockSchedulePath);
        fs.readFileSync.mockReturnValue(mockScheduleContent);

        await scheduleCommand.execute(message);

        expect(message.reply).toHaveBeenCalledWith({
            embeds: [
                {
                    title: "📅 Schedule",
                    description: `**English Schedule:**\nNo data available.\n\n**Horaire Français:**\nAucune donnée disponible.`,
                    color: 0x3498db,
                },
            ],
        });
    });

    it('should reply with an error message when reading the file fails', async () => {
        const mockSchedulePath = '/mock/path/schedule.txt';

        path.join.mockReturnValue(mockSchedulePath);
        fs.readFileSync.mockImplementation(() => {
            throw new Error('File read error');
        });

        await scheduleCommand.execute(message);

        expect(message.reply).toHaveBeenCalledWith("Unable to fetch the schedule.");
    });
});