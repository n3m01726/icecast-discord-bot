const request = require('supertest');
const express = require('express');
const { setupWebhookServer } = require('../../utils/webhook');

describe('Webhook Server', () => {
    let app;
    let mockClient;

    beforeEach(() => {
        mockClient = {
            channels: {
                fetch: jest.fn(),
            },
        };
        app = express();
        setupWebhookServer(mockClient);
    });

    it('should return 403 if IP is not allowed', async () => {
        const response = await request(app)
            .post('/v1/rotation')
            .set('X-Forwarded-For', '192.168.1.1') // Simulate a disallowed IP
            .send({});

        expect(response.status).toBe(403);
        expect(response.body.error).toBe('Accès interdit depuis cette IP.');
    });

    it('should return 403 if webhookSecret is invalid', async () => {
        process.env.WEBHOOK_SECRET = 'valid-secret';
        const response = await request(app)
            .post('/v1/rotation')
            .set('X-Forwarded-For', '127.0.0.1') // Allowed IP
            .send({ message: 'Test message', webhookSecret: 'invalid-secret' });

        expect(response.status).toBe(403);
        expect(response.body.error).toBe('Clé secrète invalide.');
    });

    it('should return 400 if message is missing', async () => {
        process.env.WEBHOOK_SECRET = 'valid-secret';
        const response = await request(app)
            .post('/v1/rotation')
            .set('X-Forwarded-For', '127.0.0.1') // Allowed IP
            .send({ webhookSecret: 'valid-secret' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Le paramètre "message" est requis.');
    });

    it('should send a message successfully', async () => {
        process.env.WEBHOOK_SECRET = 'valid-secret';
        process.env.CHANNEL_ID = '1234567890';

        const mockChannel = {
            type: 0,
            send: jest.fn().mockResolvedValue(true),
        };

        mockClient.channels.fetch.mockResolvedValue(mockChannel);

        const response = await request(app)
            .post('/v1/rotation')
            .set('X-Forwarded-For', '127.0.0.1') // Allowed IP
            .send({ message: 'Test message', webhookSecret: 'valid-secret' });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(mockClient.channels.fetch).toHaveBeenCalledWith('1234567890');
        expect(mockChannel.send).toHaveBeenCalledWith('📢 **Notification :** Test message');
    });

    it('should return 500 if there is an internal error', async () => {
        process.env.WEBHOOK_SECRET = 'valid-secret';
        process.env.CHANNEL_ID = '1234567890';

        mockClient.channels.fetch.mockRejectedValue(new Error('Internal error'));

        const response = await request(app)
            .post('/v1/rotation')
            .set('X-Forwarded-For', '127.0.0.1') // Allowed IP
            .send({ message: 'Test message', webhookSecret: 'valid-secret' });

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Erreur interne.');
        expect(response.body.details).toBe('Internal error');
    });

    it('should return 200 for GET /v1/rotation', async () => {
        const response = await request(app)
            .get('/v1/rotation')
            .set('X-Forwarded-For', '127.0.0.1'); // Allowed IP

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Le serveur webhook fonctionne correctement.');
    });
});