# 🎵 soundSHINE Bot

A Discord bot to stream your station directly from your Discord server.

ℹ️ Check it in action on my Discord Channel: [https://discord.gg/DpgzXGRsWB](https://discord.gg/DpgzXGRsWB) 


## 🚀 Features
- 🔊 **Stream playback**: Automatically connects to a voice channel and streams the radio.
- 🎶 **Now playing display**: Shows the currently playing track.
- 🔄 **Auto status update**: Updates the bot's status with the current track.
- 🎙️ **Auto speaker role**: Automatically joins as a speaker in voice channels.
- 📊 **Statistics**: Command to show radio stream stats with interactive buttons.
- 🏞️ **Get a wallpaper**: Fetches a random wallpaper from Unsplash.
- 📅 **Schedule viewer**: Shows a bilingual (FR/EN) schedule via buttons.

## 🏗️ Tech Stack

- [Node.js](https://nodejs.org/) with [discord.js](https://discord.js.org/)
- [Icecast API](http://icecast.org/) for stream metadata
- Modular command, event, and task loaders

## 📜 Installation

### 1. Clone the repo

```bash
git clone https://github.com/n3m01726/soundshine-bot.git
cd soundshine-bot
```
### 2. Install dependencies
`npm install`

### 3. Configure your environment
Create a file named .env at the root of your project (optional, depending on your setup), or use config/dev.json or config/prod.json.

Example dev.json:

```
{
  "BOT_TOKEN": "your_discord_bot_token",
  "PREFIX": "!s",
  "STREAM_URL": "https://your-stream-url.com/stream",
  "JSON_URL": "https://your-stream-url.com/status-json.xsl",
  "UNSPLASH_ACCESS_KEY": "your_unsplash_key",
  "VOICE_CHANNEL_ID": "123456789",
  "OWNER_ROLE_ID": "owner_role_id",
  "ADMIN_ROLE_ID": "admin_role_id",
  "ANNOUNCEMENTS_CHANNEL_ID": "channel_id",
  "BOT_ROLE_NAME": "soundSHINE"
}
```
Set the environment using:

```
NODE_ENV=dev node index.js
```

Or use a start script in package.json to automate that.

### 4. Start the bot
```
node index.js
```
Or:
```
npm start

```

## 🔧 Core Commands
| Command | Description |
|----------|-----------|
|`!s play`	|   Connects the bot to a voice channel and plays the stream |
|`!s np`	  |    Shows the currently playing track |
|`!s stop`	 |  Stops the stream and disconnects from voice channel |
|`!s stats`	|   Shows listener stats + buttons for full stats and history |
|`!s getwall`|	Displays a random wallpaper from Unsplash |
|`!s schedule`|	Shows the current schedule in FR or EN (user chooses) |

## 🆕 Recent Additions
- ✅ Modular architecture for commands, events, tasks
- ✅ Interactive buttons in !sstats and !sschedule
- ✅ Bilingual schedule support (FR/EN)
- ✅ Error handling and logging with winston
- ✅ Role-based access for admin-only commands

## 🧠 Planned Features / TODO
- ~~🛠️ Dynamic environment-based config (dev.json, prod.json)~~
- 🛠️ Moderation tools: Commands to help manage the community.
- ~~🔄 Auto-refresh now playing every X seconds~~
- 🗓️ Integration with Google Calendar / Notion / Airtable for show planning
- 💬 Slash commands + autocomplete
- ~~🛎️ Notification system when a new show starts~~
- 📻 Command to add new shows to the stream via API

## 🤝 Contributing
All help is welcome! Feel free to open an issue or pull request if you'd like to contribute a feature or fix.

## 📜 License
This project is licensed under the MIT License.
