const config = require('../config');
const { isQuotedMessage } = require('./quotedMessageHandler');

const commands = new Map();

// Register a command with access level
const registerCommand = (command) => {
    commands.set(command.fullCommand, command);
};

// Execute the command based on mode, access level, and quoted message handling
const executeCommand = async (commandName, sock, message) => {
    const command = commands.get(commandName);
    const sender = message.key.remoteJid;
    const botId = sock.user.id
    const isAdmin = config.SUDO.includes(sender.replace('@s.whatsapp.net', ''));
    const isOwner = sender.replace('@s.whatsapp.net', '') === config.OWNER;
    const isBotOwner = sender === botId;  // Check if the sender is the bot's own ID
    

    // Initialize variables for command text and quoted message info
    let commandText;
    let quotedMessageInfo = null;

    // Check if the message is a quoted message and extract command text and quoted message info
    if (isQuotedMessage(message)) {
        commandText = message.message.extendedTextMessage.text; // Text from quoted message
        quotedMessageInfo = message.message.extendedTextMessage.contextInfo.quotedMessage.conversation; // Info of quoted message
    } else if (message.message && message.message.conversation) {
        commandText = message.message.conversation; // Text from regular message
    }

    // Ensure we have a valid command and message text
    if (command && commandText) {
        const args = commandText.split(/\s+/).slice(1); // Arguments from the command

        // Access control based on mode, access level, and user type
        if (isOwner || isAdmin || isBotOwner) {
            // Admin and owner have unrestricted access
            await command.execute(sock, message, args, quotedMessageInfo);
        } else if (config.MODE === 'public' && command.accessLevel === 'public') {
            await command.execute(sock, message, args, quotedMessageInfo);
        } else if (config.MODE === 'private' && command.accessLevel !== 'public') {
            await command.execute(sock, message, args, quotedMessageInfo);
        } else {
            // If access level is not met
            await sock.sendMessage(sender, { text: "_This command is only for owner of bot and sudo._" });
        }
    } else {
        console.log(`Command "${commandName}" not found or invalid message format.`);
    }
};

// Export the commands map and functions
module.exports = { registerCommand, executeCommand, commands };
