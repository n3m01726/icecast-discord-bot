import discord
from discord.ext import commands

class JoinCommand(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command()
    async def join(self, ctx):
        """Command to join a voice channel."""
        if not ctx.author.voice or not ctx.author.voice.channel:
            await ctx.send("You need to be in a voice channel to use this command.")
            return

        voice_channel = ctx.author.voice.channel

        if ctx.voice_client and ctx.voice_client.is_connected():
            await ctx.send("I am already connected to a voice channel.")
        else:
            await voice_channel.connect()
            await ctx.send(f"Joined {voice_channel.name}")

async def setup(bot):
    await bot.add_cog(JoinCommand(bot))