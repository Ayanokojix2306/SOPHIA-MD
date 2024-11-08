const Command = require('../lib/Command'); // Import Command structure
const config = require('../config');
const os = require('os');
const fs = require('fs');

const handlePingCommand = async (sock, message) => {
    const startTime = Date.now(); // Record start time
    const reply = 'Pong! 🏓'; // Response message
    await sock.sendMessage(message.key.remoteJid, { text: reply }); // Send response
    const endTime = Date.now(); // Record end time
    const latency = endTime - startTime; // Calculate latency
    await sock.sendMessage(message.key.remoteJid, { text: `Latency: ${latency} ms` }); // Send latency message
};
 // Import Command structure

const handleStatusCommand = async (sock, message) => {
    const detectPlatform = () => {
    const hostname = os.hostname();

    if (hostname.includes('heroku')) {
        return 'Heroku';
    } else if (hostname.includes('render')) {
        return 'Render';
    } else if (hostname.includes('vps')) {
        return 'VPS';
    } else if (fs.existsSync('/tmp/render/')) {
        return 'Render'; // Specific check for Render
    } else if (fs.existsSync('/app')) {
        return 'Heroku'; // Specific check for Heroku
    } else {
        return 'Unknown Platform';
    }
};

const handleStatusCommand = async (sock, message) => {
    const uptime = (Date.now() - global.startTime) / 1000; // Use global.startTime to calculate uptime
    const uptimeFormatted = new Date(uptime * 1000).toISOString().substr(11, 8); // Format uptime as HH:MM:SS
    const botMode = config.MODE || "Unknown"; // Mode: public or private (based on your config)

    const platform = detectPlatform(); // Detect the platform

    // Create a more visually appealing message
    const replyMessage = `
✨ **Bot Status** ✨

🟢 **Online**: SOPHIA MD is currently up and running!

⏱️ **Uptime**: ${uptimeFormatted} (HH:MM:SS)

🔒 **Mode**: ${botMode === 'public' ? 'Public' : 'Private'}

🌐 **Platform**: ${platform}
`;

    // Send the status reply
    await sock.sendMessage(message.key.remoteJid, { text: replyMessage });
};


// Create a new command instance for status
const statusCommand = new Command('status', 'Displays the current status of the bot', handleStatusCommand);

const pingCommand = new Command('ping', 'Responds with Pong and latency', handlePingCommand);

module.exports = { statusCommand,pingCommand };
