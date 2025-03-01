# -*- coding: utf-8 -*-

import os
import logging
from dotenv import load_dotenv
import discord
from discord.ext import commands
import sys
import locale
import asyncio

# Load environment variables
load_dotenv()

# Configuration variables
STREAM_URL = "https://stream.soundshineradio.com:8445/stream"
JSON_URL = "https://stream.soundshineradio.com:8445/status-json.xsl"
BOT_TOKEN = os.getenv("BOT_TOKEN")
BOT_ROLE_NAME = "soundSHINE Radio"
VOICE_CHANNEL_ID = int(os.getenv("VOICE_CHANNEL_ID"))
ADMINBOT_CHANNEL_ID = int(os.getenv("ADMINBOT_CHANNEL_ID"))
ADMIN_ROLE_ID = int(os.getenv("ADMIN_ROLE_ID"))
ANNOUNCEMENTS_CHANNEL_ID = int(os.getenv("ANNOUNCEMENTS_CHANNEL_ID"))

# Setup logging
logging.basicConfig(level=logging.INFO)

# Create intents for permissions
intents = discord.Intents.default()
intents.message_content = True
intents.members = True

# Create a bot instance with intents
bot = commands.Bot(command_prefix="!s", intents=intents)

async def main():
    # Load commands and events
    await bot.load_extension("commands.play")
    await bot.load_extension("commands.join")
    await bot.load_extension("commands.stop")
    await bot.load_extension("commands.np")
    await bot.load_extension("commands.stats")
    await bot.load_extension("commands.schedule")
    await bot.load_extension("commands.getwall")
    await bot.load_extension("commands.quiz")
    await bot.load_extension("events.on_ready")
    await bot.load_extension("events.on_message")
    await bot.load_extension("tasks.update_status")
    await bot.load_extension("tasks.ensure_connected")

    await bot.start(BOT_TOKEN)

sys.stdout.reconfigure(encoding='utf-8')
locale.setlocale(locale.LC_ALL, 'fr_FR.UTF-8')  # Adapter selon ton serveur

asyncio.run(main())