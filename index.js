const express = require('express');
const makeWASocket = require('@whiskeysockets/baileys').default;
const { MongoClient } = require('mongodb');
const useMongoDBAuthState = require('./lib/database/mongoAuthState');
const { DisconnectReason } = require('@whiskeysockets/baileys'); // Add this line
const QRCode = require('qrcode');
const { isQuotedMessage } = require('./lib/quotedMessageHandler');
const sendRestartMessage = require('./lib/restartMessage'); // Import your sendRestartMessage function
const { registerCommand, executeCommand, commands } = require('./lib/commandHandler'); // Import command handler functions
const config = require('./config');
const { registerCommands } = require('./lib/CommandRegistry');

const app = express();
const port = process.env.PORT || 10000;
const mongoURL = process.env.MONGODB_URI || 'mongodb+srv://Saif:Arhaan123@cluster0.mj6hd.mongodb.net';

// Declare qrCodeData in a higher scope
let qrCodeData = '';

async function connectionLogic() {
  const mongoClient = new MongoClient(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  await mongoClient.connect();
  const collection = mongoClient.db('whatsapp_api').collection('auth_info_baileys');
  const { state, saveCreds } = await useMongoDBAuthState(collection);
let restartMessageSent = false; // Flag to track if the restart message has been sent
    let reconnectAttempt = false; // Flag to prevent immediate reconnections
    const reconnectDelay = 10000; // Delay in milliseconds before trying to reconnect // Flag to track the first connection
  const sock = makeWASocket({
    auth: state,
  });

  // Handle QR Code generation
  sock.ev.on('connection.update', async (update) => {
    const { qr, connection, lastDisconnect } = update;
    if (qr) {
      qrCodeData = await QRCode.toDataURL(qr); 
      // Convert to a data URL for display
      console.log("qr code sent successfully ✅");
      console.log(JSON.stringify(qrCodeData)); // Add this line to log the QR code dat
    }
    // Check if the connection is established
    // Check if the connection is established
        if (connection === 'open' && !restartMessageSent) {
            await sendRestartMessage(sock); // Send restart message when the bot is online
            restartMessageSent = true; // Set flag to true to prevent further messages
            console.log("Restart message sent.");
        }

        if (connection === 'close' && lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
            if (!reconnectAttempt) { // Prevent immediate reconnection attempts
                reconnectAttempt = true; // Set flag to indicate reconnection attempt
                console.log("Attempting to reconnect in 10 seconds...");
                setTimeout(() => {
                    connectionLogic(); // Reconnect after delay
                }, reconnectDelay);
            }
        }
    });

  
  registerCommands();
  // Message event handler to respond to "hi" or "hello" and anime feature
  sock.ev.on('messages.upsert', async (messageInfo) => {
    const message = messageInfo.messages[0];
console.log("Received message:", JSON.stringify(message, null, 2)); // Log the message structure
    // removed the condition that makes bot not reply it's own message

    const text = message.message?.conversation ||
                     message.message?.extendedTextMessage?.text ||
                     '';
const isPrivateChat = message.key.remoteJid.endsWith('@s.whatsapp.net');
    // Regex for commands
const isQuoted = isQuotedMessage(message);
    

    // Check for the command using the configured prefix
    const commandMatch = text.match(`^${config.HANDLER}(\\w+)`); // Detect commands based on config handler
    if (commandMatch) {
        const commandName = `${config.HANDLER}${commandMatch[1]}`; // Construct full command name
        await executeCommand(commandName, sock, message); // Execute the command
        return; // Stop further processing
    }
    
    const greetingRegex = /^(hi|hello)\b/i; //regex for Hi and hello Shi
    // Check for the anime command
    

    // Check for greeting messages only in private chat
    if (isPrivateChat && greetingRegex.test(text.toLowerCase())) {
        await sock.sendMessage(message.key.remoteJid, { text: 'You wanna buy a bot!? 👋' });
    }
});

  sock.ev.on('creds.update', saveCreds);
}

connectionLogic();

// Serve the QR code at the root URL
app.get('/', (req, res) => {
  if (qrCodeData) {
    res.send(`<h2>Scan the QR Code below with WhatsApp:</h2><img src="${qrCodeData}" />`);
  } else {
    res.send('<h2>QR Code not generated yet. Please wait...</h2>');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
