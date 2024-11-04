const { isQuotedMessage } = require('./quotedMessageHandler');

const commands = new Map(); // Use a Map to store commands

// Function to register a command
const registerCommand = (command) => {
    commands.set(command.fullCommand, command);
};

// Function to execute a command
const executeCommand = async (commandName, sock, message) => {
    const command = commands.get(commandName);

    // Initialize variables for command text and quoted message info
    let commandText;
    let quotedMessageInfo = null;

    // Check for quoted message and extract command text accordingly
    if (isQuotedMessage(message)) {
        commandText = message.message.extendedTextMessage.text; // Get text from quoted message
        quotedMessageInfo = message.message.extendedTextMessage.contextInfo.quotedMessage.conversation; // Get quoted message info if needed
    } else if (message.message && message.message.conversation) {
        commandText = message.message.conversation; // Get text from standard message
    }

    // Check if we have valid command text
    if (command && commandText) {
        const args = commandText.split(/\s+/).slice(1); // Split message into arguments without trimming

        // Execute the command with the necessary parameters
        await command.execute(sock, message, args, quotedMessageInfo);
    } else {
        console.log(`Command "${commandName}" not found or invalid message format.`);
        // Optional: You could send a response back to the user here
    }
};

// Export the commands map and functions
module.exports = { registerCommand, executeCommand, commands };
