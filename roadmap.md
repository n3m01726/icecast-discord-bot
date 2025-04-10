# 🚀 Roadmap V2 — Bot SoundSHINE

## 🎯 Objectifs principaux

### 1. 🎚️ Gestion multi-stream
- Gérer plusieurs flux audio (ex: plusieurs chaînes ou émissions).
  - Option 1 : Un seul bot qui peut switcher de stream via commande (`!bot url_stream`)
  - Option 2 : Plusieurs bots, un par stream (`!spop`, `!slowfi`, etc.)

### 2. 🧭 Tableau de bord de contrôle
- Interface visuelle (web, Notion, Airtable) pour :
  - Planifier les émissions / messages automatisés (rotation, annonces)
  - Voir les stats (chansons jouées, messages envoyés)
  - Contrôler le bot à distance

### 3. 📣 Intégration réseaux sociaux
- Automatiser les publications sur Instagram, Facebook, Threads ou X :
  - Now playing en direct
  - Annonces de lives
  - Rappels d’émissions à venir

---

## 💡 Idées folles / Nice to have

### 🗣️ Text-to-speech dans le vocal
- Le bot peut lire les annonces à voix haute (intro, outro, annonce de l’émission suivante)

### 📻 NowPlaying en live
- Mise à jour automatique dans un canal texte ou vocal (nom du show, visuel, lien d’écoute)

### 🗓️ Interface visuelle de planification
- Intégration avec Google Agenda / Airtable
- Commande style :  
  ```
  !s addshow NomDuShow | StartTime | EndTime | Description
  ```
  → qui envoie l'émission sur le site web ET sur Google Calendar

### 📡 Intégration AzuraCast ou RadioBoss
- Contrôle des playlists / metadata directement via API
- Synchronisation en temps réel avec ce qui est diffusé

### 🧠 IA générative
- Générer automatiquement :
  - Visuels en fonction de l’ambiance musicale
  - Résumés des shows à partir du titre et de la playlist

### 🌍 API publique
- Offrir une API REST :
  - Liste des chansons jouées
  - Horaire des émissions
  - Info du stream actif

---

## 🔧 Améliorations techniques

### 1. 🧱 Refactor & Modularité
- Architecture claire :
  - Sources de données
  - Format d’embed
  - Webhooks
- Tout ce qui est spécifique à un show doit être découplé (ex : couleur, logo, format de message)

### 2. 🌍 ENV multiples (dev/prod)
- Pour tester les changements sans impacter le stream principal

### 3. 📝 Logs & Monitoring
- Logs détaillés dans un canal Discord privé
- Optionnel : intégration avec Grafana / Loki

### 4. 🧪 Testing automatisé
- Tests unitaires (Jest / Mocha)
- CI pour éviter les régressions

### 5. 💾 Cache des données
- Stockage temporaire avec Redis ou SQLite pour éviter les requêtes multiples

### 6. 🚀 Performances
- Optimisation des appels réseau
- Réduction de la latence sur les webhooks et commandes

### 7. 🔁 Versioning / changelog
- Commande `!version` qui retourne la version actuelle du bot et les derniers changements
