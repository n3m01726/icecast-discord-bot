const axios = require('axios');
const { checkStreamOnline } = require('../../utils/checkStreamOnline');

jest.mock('axios');

describe('checkStreamOnline', () => {
    it('should return true if stream is online', async () => {
        axios.get.mockResolvedValue({
            data: {
                icestats: {
                    source: {
                        title: "Live Stream"
                    }
                }
            }
        });

        const result = await checkStreamOnline();
        expect(result).toBe(true);
    });

    it('should return false if stream is offline', async () => {
        axios.get.mockResolvedValue({
            data: {
                icestats: {
                    source: {
                        title: ""
                    }
                }
            }
        });

        const result = await checkStreamOnline();
        expect(result).toBe(false);
    });

    it('should return false if there is an error', async () => {
        axios.get.mockRejectedValue(new Error('Network Error'));

        const result = await checkStreamOnline();
        expect(result).toBe(false);
    });
});