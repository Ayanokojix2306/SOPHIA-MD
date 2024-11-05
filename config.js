// config.js
module.exports = {
    SUDO: process.env.SUDO ? process.env.SUDO.split(',') : ['2348073765008'], // Fallback to default if not set
    OWNER: process.env.OWNER || 'Kuju', // Updated owner name
    HANDLER: process.env.HANDLER || '.'
    MODE: process.env.MODE || 'private'
};
