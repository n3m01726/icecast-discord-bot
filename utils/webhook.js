const express = require('express');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

function setupWebhookServer(client) {
    const app = express();
    const PORT = process.env.WEBHOOK_PORT || 3690;

    const allowedIPs = ['127.0.0.1', '::1']; // Ajoute ici les IPs autorisées

    // Middleware pour filtrer les IPs
    app.use((req, res, next) => {
        const ip = req.ip.replace('::ffff:', '');
        if (!allowedIPs.includes(ip)) {
            return res.status(403).json({ error: 'Accès interdit depuis cette IP.' });
        }
        next();
    });

    // Middleware rate limiter
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 20,
        standardHeaders: true,
        legacyHeaders: false,
    });
    app.use('/v1/rotation', limiter); // Endpoint masqué

    app.use(express.json());

    // Point d'entrée webhook sécurisé
    app.post('/v1/rotation', (req, res) => { 
        const { message, webhookSecret } = req.body;
        const expectedSecret = process.env.WEBHOOK_SECRET;
        const textChannelId = process.env.CHANNEL_ID;

        if (webhookSecret !== expectedSecret) {
            return res.status(403).json({ error: 'Clé secrète invalide.' });
        }

        if (!message) {
            return res.status(400).json({ error: 'Le paramètre "message" est requis.' });
        }

        client.channels.fetch(textChannelId)
            .then(channel => {
                if (!channel || channel.type !== 0) {
                    throw new Error('Le canal spécifié n\'est pas un canal textuel.');
                }
                return channel.send(`📢 **Notification :** ${message}`);
            })
            .then(() => {
                res.json({ success: true, message: 'Message envoyé avec succès.' });
            })
            .catch(error => {
                res.status(500).json({ error: 'Erreur interne.', details: error.message });
            });
    });

    app.get('/v1/rotation', (req, res) => {
        res.json({ success: true, message: 'Le serveur webhook fonctionne correctement.' });
    });

    app.listen(PORT, () => {
        console.log(`Serveur webhook en écoute sur le port ${PORT}`);
    });
}

module.exports = { setupWebhookServer };
