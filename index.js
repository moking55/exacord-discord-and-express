const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { createApp } = require('./express/app');
const { port } = require('./express/config');
const { logger } = require('./utils/logger');
require('dotenv').config();

// --- DISCORD BOT SETUP ---
// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// --- COMMAND HANDLING ---
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'bot/commands');
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(folderPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
        logger.info(`Loaded command: /${command.data.name}`);
    }
    if (commandFiles.length === 0) {
        logger.warn(`No command files found in folder: ${folderPath}`);
    }
}


// --- EVENT HANDLING ---
const eventsPath = path.join(__dirname, 'bot/events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
    logger.info(`Loaded event: ${event.name}`);
}

// --- EXPRESS API SETUP ---
const app = createApp(client);
app.listen(port, () => {
    logger.info(`🚀 API server is running on http://localhost:${port}`);
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
