const Command = require('../lib/Command'); // Import Command structure

const { isQuotedMessage, getQuotedInfo, replyToQuotedMessage } = require('../lib/quotedMessageHandler');

// Main function to handle the quote responder command
async function handleQuoteResponderCommand(sock, message) {
  console.log("Handling quote responder command with message:", JSON.stringify(message, null, 2)); // Log incoming message

  try {
    if (isQuotedMessage(message)) {
      const quotedInfo = getQuotedInfo(message); // Get information about the quoted message

      // Extract the actual quoted message content
      const quotedMessageContent = quotedInfo.quotedMessage ? quotedInfo.quotedMessage.conversation : "No conversation text";

      // Send the quoted message back to the user
      await sock.sendMessage(message.key.remoteJid, { text: `Quoted Message: "${quotedMessageContent}"` });
    } else {
      // Inform user that no quoted message was detected
      await sock.sendMessage(message.key.remoteJid, { text: "Please quote a message to use this command, baka!" });
    }
  } catch (error) {
    console.error("Error handling quote responder command:", error);
    await sock.sendMessage(message.key.remoteJid, { text: "An error occurred. Please try again later." });
  }
}

const quotedCommand = new Command('quoted', 'quotes a message', handleQuoteResponderCommand);

module.exports = quotedCommand
