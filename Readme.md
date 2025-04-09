# 🎵 soundSHINE Radio Bot

Bot Discord permettant de diffuser et gérer soundSHINE Radio directement depuis un serveur Discord.

## 🚀 Fonctionnalités

- 🔊 **Lecture du stream** : Se connecte automatiquement à un salon vocal et joue la radio.
- 🎶 **Affichage du titre en cours** : Affiche la chanson actuellement diffusée.
- 🔄 **Mise à jour du statut** : Change automatiquement le statut du bot avec la musique en cours.
- 🎙️ **Prise de parole automatique** : Se met automatiquement en tant qu'intervenant sur les salons vocaux.
- 🛠️ **Modération** : Intégration de commandes pour aider à gérer la communauté.
- 📊 **Statistiques** : Commande pour afficher les statistiques de la radio.
- 🏞️ **Get a wallpaper** : Commande pour afficher un wallpaper de Unsplash
- 📅 **Horaire** : Affiche l'horaire en embed (FR/EN)

## 🏗️ Technologies utilisées

- [Node.js](https://nodejs.org/) avec [discord.js](https://discord.js.org/)
- [Icecast API](http://icecast.org/) pour récupérer les métadonnées du stream

## 📜 Installation

### 1. Cloner le repo

```
   git clone https://github.com/n3m01726/soundshine-bot.git
   cd soundshine-bot
```

### 2. Installer les dépendances

`npm i`

### 3. Configurer le fichier .env

Crée un fichier .env à la racine du projet et ajoute les informations suivantes :

```
BOT_TOKEN=your_discord_bot_token
PREFIX=!s
STREAM_URL=YourstreamURL
```

### 4. Lancer le bot

`node index.js` ou `npm start`

### 🔧 Commandes principales

| Commande   | Description                                        |
| ---------- | -------------------------------------------------- |
| !splay     |  Connecte le bot à un salon vocal et joue la radio |
| !snp       |  Affiche la musique actuellement jouée             |
| !sstop     |  Déconnecte le bot du salon vocal                  |
| !sstats    |  Affiche les statistiques de la radio              |
| !sgetwall  |  Affiche un walllpaper de Unsplash                 |
| !sschedule |  Affiche l'horaire de la radio                     |

### 📌 TODO / Améliorations futures

### 🤝 Contribuer

Toute aide est bienvenue! Ouvre une issue ou une pull request si tu souhaites proposer une amélioration!

### 📜 Licence

Ce projet est sous licence MIT.
