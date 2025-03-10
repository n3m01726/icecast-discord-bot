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
        GatewayIntentBits.GuildVoiceStates, // nécessaire pour les états vocaux
    ],
});

// Collection pour les commandes
client.commands = new Collection();
client.config = { PREFIX }; // Assure-toi que le PREFIX est dans config

console.log(`Préfixe configuré: ${PREFIX}`); // Log pour vérifier le préfixe

// Charger les commandes
const commandsPath = path.join(__dirname, 'commands'); // Corriger le chemin d'accès
if (fs.existsSync(commandsPath)) {
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
} else {
    console.warn(`⚠️ Le répertoire des commandes n'existe pas: ${commandsPath}`);
}

// Charger les événements
const eventsPath = path.join(__dirname, 'events'); // Corriger le chemin d'accès
if (fs.existsSync(eventsPath)) {
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(path.join(eventsPath, file));

        // ⚠️ Empêche les doublons sur messageCreate
        if (event.name === 'messageCreate') {
            client.removeAllListeners('messageCreate');
            console.log('🛠 Écouteur messageCreate réinitialisé.');
        }

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }

        console.log(`✅ Événement chargé: ${event.name}`);
    }
} else {
    console.warn(`⚠️ Le répertoire des événements n'existe pas: ${eventsPath}`);
}

// Charger les tâches
const tasksPath = path.join(__dirname, 'tasks'); // Corriger le chemin d'accès
if (fs.existsSync(tasksPath)) {
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
} else {
    console.warn(`⚠️ Le répertoire des tâches n'existe pas: ${tasksPath}`);
}

// Vérifie combien de fois l'événement messageCreate est attaché
console.log(`🔍 Nombre d'écouteurs pour messageCreate: ${client.listenerCount('messageCreate')}`);

// Démarrer le bot
client.login(BOT_TOKEN);
