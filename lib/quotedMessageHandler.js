// Check if the message is a quoted message
function isQuotedMessage(message) {
  return (
    message.message &&
    message.message.extendedTextMessage &&
    message.message.extendedTextMessage.contextInfo &&
    message.message.extendedTextMessage.contextInfo.stanzaId
  );
}

// Get the entire context info of the quoted message
function getQuotedInfo(message) {
  if (isQuotedMessage(message)) {
    // Add debugging information to see what the quoted message contains
    console.log("Quoted Message Context:", message.message.extendedTextMessage.contextInfo);
    return message.message.extendedTextMessage.contextInfo || {};
  }
  return {};
}

// Reply to the quoted message
async function replyToQuotedMessage(sock, message, replyText) {
  try {
    if (isQuotedMessage(message)) {
      const quotedId = message.message.extendedTextMessage.contextInfo.stanzaId;
      const quotedRemoteJid = message.key.remoteJid;
      const participant = message.message.extendedTextMessage.contextInfo.participant || message.key.participant;

      // Create the context info for the quoted message
      const contextInfo = {
        stanzaId: quotedId,
        participant: participant,
        quotedMessage: message.message.extendedTextMessage.contextInfo.quotedMessage,
      };

      await sock.sendMessage(quotedRemoteJid, { text: replyText }, { quoted: { key: { id: quotedId, participant }, contextInfo } });
    } else {
      await sock.sendMessage(message.key.remoteJid, { text: "No quoted message found." });
    }
  } catch (error) {
    console.error("Error replying to quoted message:", error);
    await sock.sendMessage(message.key.remoteJid, { text: "An error occurred while replying to the quoted message." });
  }
}

// Export the functions for use in other modules
module.exports = {
  isQuotedMessage,
  getQuotedInfo,
  replyToQuotedMessage,
};
