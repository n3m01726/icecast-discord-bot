const mongoose = require('mongoose');

// Connexion à la base de données
mongoose.connect('mongodb://localhost:27017/streamBot', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Définir un schéma pour le programme
const scheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    unique: true,
    enum: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'],
  },
  programs: [{
    title: String,
    time: String,
  }],
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

// Fonction pour obtenir le programme d'un jour
async function getSchedule(day) {
  try {
    const schedule = await Schedule.findOne({ day }).exec();
    return schedule ? schedule.programs : null;
  } catch (err) {
    console.error(`Error retrieving schedule for ${day}:`, err);
    return null;
  }
}

// Fonction pour ajouter ou mettre à jour le programme d'un jour
async function addOrUpdateSchedule(day, programs) {
  try {
    const schedule = await Schedule.findOneAndUpdate(
      { day },
      { programs },
      { upsert: true, new: true } // Créer si inexistant, sinon mettre à jour
    ).exec();
    return schedule;
  } catch (err) {
    console.error(`Error saving schedule for ${day}:`, err);
    return null;
  }
}

module.exports = { getSchedule, addOrUpdateSchedule };
