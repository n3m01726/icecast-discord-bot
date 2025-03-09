const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { BOT_TOKEN, PREFIX } = require('./config');
const fs = require('fs');
const path = require('path');

// Création du client avec les intents nécessaires
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, // pour les événements de guild
        GatewayIntentBits.GuildMessages, // pour recevoir les messages de guild
        GatewayIntentBits.MessageContent, // nécessaire pour lire le contenu des messages
    ],
});

// Collection pour les commandes
client.commands = new Collection();
client.config = { PREFIX }; // Assure-toi que le PREFIX est dans config

console.log(`Préfixe configuré: ${PREFIX}`); // Log pour vérifier le préfixe

// Charger les commandes
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if (command.name) {
        client.commands.set(command.name, command);
        console.log(`✅ Commande chargée: ${command.name}`);
    } else {
        console.warn(`⚠️ La commande ${file} n'a pas de nom défini.`);
    }
}

// Charger les événements
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(path.join(eventsPath, file));
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// Démarrer le bot
client.login(BOT_TOKEN);
