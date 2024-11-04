const config = require('../config.js');

const sendRestartMessage = async (sock) => {
  const restartMessage = `*_Bot has restarted and is now online 🚀_*
AVAILABLE COMMANDS:
1. !anime - Fetch anime information
2. !help - Show available commands
3. !quote - Get a random quote
4. !joke - Get a random joke
OWNER:${config.OWNER}`;
  try {
    for (const number of config.SUDO) {
      const adminJid = `${number}@s.whatsapp.net`; // Append @s.whatsapp.net here
      await sock.sendMessage(adminJid, { text: restartMessage });
    }
    console.log("Restart message sent to SUDO numbers");
  } catch (error) {
    console.error("Error sending restart message:", error);
  }
};

module.exports = sendRestartMessage;
