const axios = require('axios');
const { checkStreamOnline } = require('../../utils/checkStreamOnline');

jest.mock('axios');

describe('checkStreamOnline', () => {
    const JSON_URL = "https://stream.soundshineradio.com:8445/status-json.xsl";

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return true if the stream is online', async () => {
        const mockResponse = {
            data: {
                icestats: {
                    source: {
                        title: "Live Stream"
                    }
                }
            }
        };

        axios.get.mockResolvedValue(mockResponse);

        const result = await checkStreamOnline();
        expect(axios.get).toHaveBeenCalledWith(JSON_URL);
        expect(result).toBe(true);
    });

    it('should return false if the stream title is empty', async () => {
        const mockResponse = {
            data: {
                icestats: {
                    source: {
                        title: ""
                    }
                }
            }
        };

        axios.get.mockResolvedValue(mockResponse);

        const result = await checkStreamOnline();
        expect(axios.get).toHaveBeenCalledWith(JSON_URL);
        expect(result).toBe(false);
    });

    it('should return false if an error occurs during the request', async () => {
        axios.get.mockRejectedValue(new Error('Network Error'));

        const result = await checkStreamOnline();
        expect(axios.get).toHaveBeenCalledWith(JSON_URL);
        expect(result).toBe(false);
    });
});