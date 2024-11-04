const Command = require('../lib/Command'); // Import Command structure

const handlePingCommand = async (sock, message) => {
    const startTime = Date.now(); // Record start time
    const reply = 'Pong! 🏓'; // Response message
    await sock.sendMessage(message.key.remoteJid, { text: reply }); // Send response
    const endTime = Date.now(); // Record end time
    const latency = endTime - startTime; // Calculate latency
    await sock.sendMessage(message.key.remoteJid, { text: `Latency: ${latency} ms` }); // Send latency message
};

// Create a new command instance for ping
const pingCommand = new Command('ping', 'Responds with Pong and latency', handlePingCommand);

module.exports = pingCommand; // Export the command instance
