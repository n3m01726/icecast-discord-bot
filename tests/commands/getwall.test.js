const axios = require('axios');
const getwall = require('../../commands/getwall');

jest.mock('axios');

describe('getwall command', () => {
    let message;

    beforeEach(() => {
        message = {
            reply: jest.fn(),
        };
    });

    it('should fetch a random photo and reply with the photo URL', async () => {
        const photoUrl = 'https://example.com/photo.jpg';
        axios.get.mockResolvedValue({
            data: [{ urls: { regular: photoUrl } }],
        });

        await getwall.execute(message);

        expect(axios.get).toHaveBeenCalledWith(`https://api.unsplash.com/photos/random?client_id=${process.env.UNSPLASH_API}&count=1`);
        expect(message.reply).toHaveBeenCalledWith(photoUrl);
    });

    it('should reply with an error message if no photo URL is returned', async () => {
        axios.get.mockResolvedValue({
            data: [{}],
        });

        await getwall.execute(message);

        expect(message.reply).toHaveBeenCalledWith("Couldn't fetch a photo, try again later.");
    });

    it('should reply with an error message if the API request fails', async () => {
        axios.get.mockRejectedValue(new Error('API request failed'));

        await getwall.execute(message);

        expect(message.reply).toHaveBeenCalledWith("Unable to fetch a random photo.");
    });
});
