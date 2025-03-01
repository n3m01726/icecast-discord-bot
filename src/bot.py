# -*- coding: utf-8 -*-

import os
import logging
from dotenv import load_dotenv
import discord
from discord.ext import commands
import sys
import locale

# Load environment variables
load_dotenv()

# Configuration variables
STREAM_URL = "https://stream.soundshineradio.com:8445/stream"
JSON_URL = "https://stream.soundshineradio.com:8445/status-json.xsl"
BOT_TOKEN = os.getenv("BOT_TOKEN")
BOT_ROLE_NAME = "soundSHINE Radio"
VOICE_CHANNEL_ID = 1324247709502406748
ADMINBOT_CHANNEL_ID=1338181640081510401 # AdminBot channel
ADMIN_ROLE_ID=1292528573881651372 # Admin role
ANNOUNCEMENTS_CHANNEL_ID = 1334280886895775794  # Remplace par l'ID du canal annonces

# Setup logging
logging.basicConfig(level=logging.INFO)

# Create intents for permissions
intents = discord.Intents.default()
intents.message_content = True
intents.members = True

# Create a bot instance with intents
bot = commands.Bot(command_prefix="!s", intents=intents)

# Load commands and events
bot.load_extension("commands.play")
bot.load_extension("commands.join")
bot.load_extension("commands.stop")
bot.load_extension("commands.np")
bot.load_extension("commands.stats")
bot.load_extension("commands.schedule")
bot.load_extension("commands.getwall")
bot.load_extension("commands.quiz")
bot.load_extension("events.on_ready")
bot.load_extension("events.on_message")
bot.load_extension("tasks.update_status")
bot.load_extension("tasks.ensure_connected")

sys.stdout.reconfigure(encoding='utf-8')
locale.setlocale(locale.LC_ALL, 'fr_FR.UTF-8')  # Adapter selon ton serveur

bot.run(BOT_TOKEN)