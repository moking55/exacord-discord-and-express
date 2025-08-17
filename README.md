# ExaCord — Discord.js bot + Express API

A pragmatic Discord bot (discord.js v14) paired with a modular Express API. Clean structure, centralized permissions/cooldowns, and colorful logging.

## Quick start

1) Requirements
- Node.js 18+ (LTS recommended)
- A Discord application and bot token

2) Install
```pwsh
npm install
```

3) Environment
Create a `.env` at the project root:
```env
DISCORD_TOKEN=your-bot-token
CLIENT_ID=your-application-client-id
GUILD_ID=your-development-guild-id
PORT=3000
API_PREFIX=/api
LOG_LEVEL=info
```

4) Deploy slash commands (guild)
```pwsh
npm run deploy
```

5) Run the bot + API
```pwsh
npm run start
```

Visit API endpoints:
- http://localhost:3000/api/health
- http://localhost:3000/api/status

## Project structure
```
.
├─ bot/
│  ├─ commands/
│  │  └─ ...               # Slash commands grouped by category
│  ├─ events/
│  │  ├─ ready.js
│  │  └─ interactionCreate.js
│  └─ utils/
│     └─ interactionChecks.js  # permission/role/bot-perm/cooldown checks
│
├─ express/
│  ├─ app.js
│  ├─ config/
│  │  └─ index.js          # env, port, API prefix
│  ├─ middlewares/
│  │  └─ security.js       # helmet, compression, body parsing
│  ├─ routes/
│  │  └─ health.js         # /api/health, /api/status
│  └─ services/
│     └─ healthService.js
│
├─ template/
│  └─ template.js          # command template with metadata
│
├─ utils/
│  └─ logger.js            # colorful Winston logger
│
├─ deploy-commands.js      # registers slash commands (guild)
├─ index.js                # bootstraps bot and API server
├─ package.json
└─ .env
```

## Commands
- Code your commands in `bot/commands/<category>/<name>.js` and export:
  - `data` (SlashCommandBuilder)
  - `execute(interaction)`
  - Optional metadata read by the checker:
    - `permissions`: array of PermissionFlagsBits a user must have
    - `requiredClientPermissions`: array of permissions the bot must have
    - `allowedRoles`: array of role IDs or names allowed to run the command
    - `cooldown`: seconds (per-user, per-command)

Example metadata snippet:
```js
module.exports = {
  data: new SlashCommandBuilder().setName('hello').setDescription('Hi'),
  permissions: [PermissionFlagsBits.ManageMessages],
  requiredClientPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks],
  allowedRoles: ['123456789012345678', 'Moderator'],
  cooldown: 5,
  async execute(interaction) { /* ... */ },
};
```

Centralized checks live in `bot/utils/interactionChecks.js` and run in `bot/events/interactionCreate.js` before `execute()`.

## Deploying slash commands
This project deploys commands to a single guild using `deploy-commands.js` for fast iteration.
- Ensure `CLIENT_ID`, `GUILD_ID`, and `DISCORD_TOKEN` are set.
- By default, the script scans the `bot/commands` directory. If you moved commands elsewhere, update the path in `deploy-commands.js` accordingly.
- For global commands, switch to `Routes.applicationCommands(CLIENT_ID)` (expect up to 1 hour propagation).

## Express API
- Built from `express/app.js` and mounted at `API_PREFIX` (default `/api`).
- Endpoints included:
  - `GET /api/health`: simple liveness check
  - `GET /api/status`: Discord client stats (guilds, users, uptime)
- Middlewares: `helmet`, `compression`, and JSON/urlencoded parsing.

## Logging
- `utils/logger.js` provides colorful, timestamped logs with stack traces using Winston.
- Configure level via `LOG_LEVEL` (default `debug` in code, `info` recommended in prod).

## Troubleshooting
- Commands not showing in Discord:
  - Re-run `npm run deploy` after adding/editing commands.
  - Confirm `CLIENT_ID` and `GUILD_ID` target the server you’re testing in.
- Missing permissions errors:
  - Check `permissions` (user) and `requiredClientPermissions` (bot) in your command.
- Cooldown not working:
  - Ensure your command sets a numeric `cooldown` (seconds).
- Token errors:
  - Verify `DISCORD_TOKEN` in `.env` and that your bot is invited to the guild with proper scopes.

## Scripts
- `npm run deploy` — register (/) commands to your dev guild
- `npm run start` — start the bot and Express API

---
Feel free to open issues or extend with more routes/services, command categories, or a shared cache (e.g., Redis) for multi-instance cooldowns.