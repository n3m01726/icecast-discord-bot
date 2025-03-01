import discord
from discord.ext import commands, tasks
from datetime import datetime, timezone
from tasks.update_status import UpdateStatusTask
from tasks.ensure_connected import EnsureConnectedTask

class OnReadyEvent(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.Cog.listener()
    async def on_ready(self):
        print(f'Logged in as {self.bot.user.name}')
        self.bot.get_cog("UpdateStatusTask").update_status.start()
        self.bot.get_cog("EnsureConnectedTask").ensure_connected.start()

async def setup(bot):
    await bot.add_cog(OnReadyEvent(bot))