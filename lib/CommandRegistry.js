// lib/CommandRegistry.js
const { registerCommand } = require('./commandHandler'); // Import the registerCommand function
const pingCommand = require('../commands/ping');
const viewonceCommand = require('../commands/viewonce');
const animeCommand = require('../commands/anime');
const uptimeCommand = require('../commands/uptime');
const neonCommand =require('../commands/textmaker');
const quoteCommand = require('../commands/quoteResponder');
// Import the uptime command

// Function to register all commands
const registerCommands = () => {
    registerCommand(pingCommand);
    registerCommand(animeCommand);
    registerCommand(uptimeCommand);
    registerCommand(neonCommand);
    registerCommand(quoteCommand);
    registerCommand(viewonceCommand);
    registerCommand(statusCommand);
    // Register the all commands here

};

// Export the registerCommands function
module.exports = { registerCommands };
