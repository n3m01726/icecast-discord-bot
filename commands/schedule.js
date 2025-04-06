const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'schedule',
    description: 'Displays the current schedule of programs',
    async execute(message) {
        try {
            const schedulePath = path.join(__dirname, '..', 'schedule.txt');
            const scheduleContent = fs.readFileSync(schedulePath, 'utf-8');

            const sections = scheduleContent.split("🗓");
            const enSchedule = sections[1]?.trim() || "No data available.";
            const frSchedule = sections[2]?.trim() || "Aucune donnée disponible.";

            const embed = {
                title: "📅 Schedule",
                description: `**English Schedule:**\n${enSchedule}\n\n**Horaire Français:**\n${frSchedule}`,
                color: 0x3498db,
            };

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Error reading schedule: ", error);
            message.reply("Unable to fetch the schedule.");
        }
    },
};
