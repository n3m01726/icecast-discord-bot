module.exports = {
  name: 'updateStatus',
  description: 'Mise à jour du statut du bot',
  async execute(client) {  // client ici au lieu de bot
    try {
      const { data } = await axios.get(JSON_URL);
      const currentSong = data.icestats.source.title || "No song available";

      await client.user.setActivity(`🎧 ${currentSong}`, { type: 'LISTENING' });
      console.log(`Updated status: ${currentSong}`);
    } catch (error) {
      console.error('Error updating status:', error);
      await client.user.setActivity('Soundshine Radio', { type: 'LISTENING' });
    }
  },
};
