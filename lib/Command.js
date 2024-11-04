// structures/Command.js
const config = require('../config'); // Import config

class Command {
    constructor(name, description, execute) {
        this.name = name; // Command name
        this.description = description; // Command description
        this.execute = execute; // Function to execute the command
    }

    // Add a method to get the full command with the prefix
    get fullCommand() {
        return `${config.HANDLER}${this.name}`; // Return full command
    }
}

module.exports = Command; // Export the Command class
