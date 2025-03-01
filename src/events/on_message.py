import discord
from discord.ext import commands

class OnMessageEvent(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.Cog.listener()
    async def on_message(self, message):
        if message.author == self.bot.user:
            return
        await self.bot.process_commands(message)

async def setup(bot):
    await bot.add_cog(OnMessageEvent(bot))