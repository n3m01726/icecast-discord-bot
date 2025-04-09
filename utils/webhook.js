require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

function setupWebhookServer(client) {
    const app = express();
    const PORT = process.env.WEBHOOK_PORT || 3690;
    const allowedIPs = process.env.ALLOWED_IPS.split(','); // Ajouter les IPs autorisées ici

    // Middleware pour filtrer les IPs
    app.use((req, res, next) => {
        const ip = req.ip.replace('::ffff:', '');
        if (!allowedIPs.includes(ip)) {
            return res.status(403).json({ error: 'Accès interdit depuis cette IP.' });
        }
        next();
    });

    // Limiteur de requêtes
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 20,
        standardHeaders: true,
        legacyHeaders: false,
    });
    app.use('/v1/rotation', limiter);

    app.use(express.json());

    // Webhook POST
    app.post('/v1/rotation', (req, res) => {
        const { playlist, webhookSecret, role } = req.body;
        const expectedSecret = process.env.WEBHOOK_SECRET;
        const textChannelId = process.env.ANNOUNCEMENTS_CHANNEL_ID;
        if (webhookSecret !== expectedSecret) {
            return res.status(403).json({ error: 'Clé secrète invalide.' });
        }

        if (!playlist) {
            return res.status(400).json({ error: 'Le paramètre "playlist" est requis.' });
        }
        if (!role) {
            return res.status(400).json({ error: 'Le paramètre "role" est requis.' });
        }
        client.channels.fetch(textChannelId)
            .then(channel => {
                if (!channel || channel.type !== 0) {
                    throw new Error('Le canal spécifié n\'est pas un canal textuel.');
                }
                return channel.send(`<@&${role}> Playlist en cours : **${playlist}**`);
            })
            .then(() => {
                logger.success(`[Webhook] Message envoyé dans #${textChannelId} : ${playlist}`);
                res.json({ success: true, message: 'Message envoyé avec succès.' });
            })
            .catch(error => {
                res.status(500).json({ error: 'Erreur interne.', details: error.message });
            });
    });

    // Webhook GET
    app.get('/v1/rotation', (req, res) => {
        const { webhookSecret, playlist, role } = req.query;  // Paramètres dans l'URL
    
        // Vérifie si le secret correspond
        const expectedSecret = process.env.WEBHOOK_SECRET;
    
        if (webhookSecret !== expectedSecret) {
            return res.status(403).json({ error: 'Clé secrète invalide.' });
        }
    
        if (!playlist) {
            return res.status(400).json({ error: 'Le paramètre "playlist" est requis.' });
        }
    const textChannelId = process.env.ANNOUNCEMENTS_CHANNEL_ID;
        // Envoie le message à Discord
        client.channels.fetch(textChannelId)
            .then(channel => {
                if (!channel || channel.type !== 0) {
                    throw new Error('Le canal spécifié n\'est pas un canal textuel.');
                }
                return channel.send(`<@&${role}> 🔊 Playlist en cours : **${playlist}**`);
            })
            .then(() => {
                res.json({ success: true, message: 'Message envoyé avec succès.' });
            })
            .catch(error => {
                res.status(500).json({ error: 'Erreur interne.', details: error.message });
            });
    });
    

    app.listen(PORT, () => {
        logger.success(`Serveur webhook en écoute sur le port ${PORT} (http://localhost:${PORT})`);
    });
}

module.exports = { setupWebhookServer };
