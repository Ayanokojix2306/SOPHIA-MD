const Command = require('../lib/Command'); // Import Command structure
const config = require('../config');
const os = require('os');
const fs = require('fs');

// Function to detect platform (Render, Heroku, VPS, or Unknown)
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

// Ping command handler
const handlePingCommand = async (sock, message) => {
    const startTime = Date.now();
    await sock.sendMessage(message.key.remoteJid, { text: 'Pong! 🏓' });
    const latency = Date.now() - startTime;
    await sock.sendMessage(message.key.remoteJid, { text: `Latency: ${latency} ms` });
};

// Status command handler
const handleStatusCommand = async (sock, message) => {
    const uptime = (Date.now() - global.startTime) / 1000;
    const uptimeFormatted = new Date(uptime * 1000).toISOString().substr(11, 8);
    const botMode = config.MODE || "Unknown";
    const platform = detectPlatform();

    const replyMessage = `
✨ **Bot Status** ✨

🟢 **Online**: SOPHIA MD is currently up and running!

⏱️ **Uptime**: ${uptimeFormatted} (HH:MM:SS)

🔒 **Mode**: ${botMode === 'public' ? 'Public' : 'Private'}

🌐 **Platform**: ${platform}
`;

    await sock.sendMessage(message.key.remoteJid, { text: replyMessage });
};

// Create command instances
const statusCommand = new Command('status', 'Displays the current status of the bot', handleStatusCommand);
const pingCommand = new Command('ping', 'Responds with Pong and latency', handlePingCommand);

module.exports = { statusCommand, pingCommand };
