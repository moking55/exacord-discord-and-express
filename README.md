// =================================================================
//
//               DISCORD.JS BOT STRUCTURE WITH EXPRESS API
//
// =================================================================
//
// This is a best-practice project structure for a Discord.js bot
// that also includes an Express.js server for a REST API.
// It's designed to be scalable and easy to maintain.
//
// -------------------- DIRECTORY STRUCTURE -------------------------
//
// my-discord-bot/
// │
// ├── commands/
// │   └── utility/
// │       └── ping.js         // Example slash command
// │
// ├── events/
// │   ├── ready.js            // Example event handler for when the bot is ready
// │   └── interactionCreate.js // Example event handler for interactions (slash commands)
// │
// ├── .env                    // Environment variables (token, clientID, etc.)
// ├── deploy-commands.js      // Script to register slash commands with Discord
// ├── index.js                // Main entry point for both the bot and the API
// └── package.json            // Project dependencies and scripts
//
// =================================================================