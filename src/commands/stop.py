import os
import discord
from discord.ext import commands
import logging

ADMIN_CHANNEL_ID = int(os.getenv("ADMINBOT_CHANNEL_ID"))

class StopCommand(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command()
    async def stop(self, ctx):
        """Command to stop the stream (only available in the admin channel)."""
        if ctx.channel.id != ADMIN_CHANNEL_ID:
            await ctx.send(f"This command can only be used in the admin channel.")
            return

        if ctx.voice_client is None:
            await ctx.send("I am not connected to a voice channel.")
            return

        await ctx.voice_client.disconnect()
        await ctx.send("Disconnected from the voice channel.")

async def setup(bot):
    await bot.add_cog(StopCommand(bot))