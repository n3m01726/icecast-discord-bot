const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { BOT_TOKEN, PREFIX } = require('./config');
const fs = require('fs');
const path = require('path');
const { updateStatus } = require('./tasks/updateStatus'); // Importer la fonction updateStatus

// Création du client avec les intents nécessaires
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, // pour les événements de guild
        GatewayIntentBits.GuildMessages, // pour recevoir les messages de guild
        GatewayIntentBits.MessageContent, // nécessaire pour lire le contenu des messages
        GatewayIntentBits.GuildVoiceStates, // nécessaire pour les états vocaux
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
        client.once(event.name, (...args) => event.execute(...args)); // Événements déclenchés une seule fois
    } else {
        client.on(event.name, (...args) => event.execute(...args)); // Événements déclenchés plusieurs fois
    }
    console.log(`✅ Événement chargé: ${event.name}`);
}

// Charger les tâches
const tasksPath = path.join(__dirname, 'tasks');
const taskFiles = fs.readdirSync(tasksPath).filter(file => file.endsWith('.js'));

for (const file of taskFiles) {
    const task = require(path.join(tasksPath, file));
    if (task.name) {
        // Pour chaque tâche, on lance un intervalle si nécessaire
        if (task.interval) {
            setInterval(() => task.execute(client), task.interval); // On suppose que task.interval est en millisecondes
        } else {
            task.execute(client); // Tâche exécutée immédiatement
        }
        console.log(`✅ Tâche chargée: ${task.name}`);
    } else {
        console.warn(`⚠️ La tâche ${file} n'a pas de nom défini.`);
    }
}

// Démarrer le bot
client.login(BOT_TOKEN);