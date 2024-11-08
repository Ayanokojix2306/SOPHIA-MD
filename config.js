// config.js
module.exports = {
    SUDO: process.env.SUDO ? process.env.SUDO.split(',') : ['2348073765008', '2347017895743'], // Fallback to default if not set
    OWNER: process.env.OWNER || '𝚫𝐘𝚫𝚴𝚯𝐊𝚯𝐉𝚰 𝐊𝚰𝐘𝚯𝚻𝚫𝐊𝚫', // Updated owner name
    HANDLER: process.env.HANDLER || '!',
    MODE: process.env.MODE || 'private'
};
