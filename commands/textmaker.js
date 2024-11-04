const axios = require('axios');
const config = require('../config');

// Main function to handle the neon command
async function handleNeonCommand(sock, message) {
  try {
    const parts = message.message.conversation.split(' '); // Split the message into parts

    // Check if an input text is provided
    if (parts.length < 2) {
      await sock.sendMessage(message.key.remoteJid, { text: 'Please provide text for the neon effect. Example: .neon Hello World!' });
      return;
    }

    const inputText = parts.slice(1).join(' '); // Join parts back into a single string

    const api_url = `https://textpro.me/neon-light-text-effect-with-galaxy-style-981.html?text=${encodeURIComponent(inputText)}`;

    await sock.sendMessage(message.key.remoteJid, { text: '_Please wait while generating the neon effect..._' });

    // Attempt to fetch the generated neon image
    try {
      const result = await axios.get(api_url); // Adjust if the API response is different
      const result_url = result.data; // Adjust based on the actual response structure

      // Attempt to send the image
      await sock.sendMessage(message.key.remoteJid, { url: result_url }, 'image');
    } catch (imageError) {
      console.error('Error fetching or sending neon image:', imageError);
      await sock.sendMessage(message.key.remoteJid, { text: 'Error generating neon effect image. Please try again later.' });
    }
  } catch (error) {
    console.error('Error handling neon command:', error);
    await sock.sendMessage(message.key.remoteJid, { text: 'An error occurred while processing your request. Please try again later.' });
  }
}

// Register the command with name, description, and handler function
const neonCommand = {
  fullCommand: `${config.HANDLER}neon`, // This should match your command prefix
  name: 'neon',
  description: 'Generates a neon text image based on the provided input. Example usage: .neon Hello World!',
  execute: handleNeonCommand
};

module.exports = neonCommand;
