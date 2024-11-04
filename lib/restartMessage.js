const config = require('../config.js');

const sendRestartMessage = async (sock) => {
  const restartMessage = `*_ *SOPHIA-MD* has restarted successfully and is now online 🚀❤️_*
AVAILABLE COMMANDS:
1. ${config.HANDLER}anime - Fetch anime information
2. ${config.HANDLER}help - Show available commands(not created yet)
3. ${config.HANDLER}quote - Get a random quote(not done yet)
4. ${config.HANDLER}joke - Get a random joke(not done yet)
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
