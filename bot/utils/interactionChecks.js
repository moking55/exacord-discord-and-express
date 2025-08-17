// utils/interactionChecks.js
// Centralized interaction checks (permissions, roles, bot perms) for chat input commands.

const cooldowns = new Map(); // Map<commandName, Map<userId, lastTimestampMs>>

function ensureUserMap(commandName) {
  if (!cooldowns.has(commandName)) cooldowns.set(commandName, new Map());
  return cooldowns.get(commandName);
}

function formatSeconds(ms) {
  const sec = Math.ceil(ms / 1000);
  return `${sec}s`;
}

module.exports.runChecks = async function runChecks(interaction, command) {
  // Each check descriptor has a `match` predicate (accepts command) and a `handler` function
  const checks = [
    {
      name: 'permissions',
      match: (cmd) => Array.isArray(cmd.permissions) && cmd.permissions.length > 0,
      handler: async (interaction, cmd) => {
        if (!interaction.member?.permissions?.has(cmd.permissions)) {
          return { ok: false, reply: 'You do not have permission to use this command.' };
        }
        return { ok: true };
      }
    },
    {
      name: 'allowedRoles',
      match: (cmd) => Array.isArray(cmd.allowedRoles) && cmd.allowedRoles.length > 0,
      handler: async (interaction, cmd) => {
        if (!interaction.member) {
          return { ok: false, reply: 'This command must be used in a server.' };
        }
        const hasRole = interaction.member.roles.cache.some(r => cmd.allowedRoles.includes(r.id) || cmd.allowedRoles.includes(r.name));
        if (!hasRole) {
          return { ok: false, reply: 'You must have one of the required roles to use this command.' };
        }
        return { ok: true };
      }
    },
    {
      name: 'requiredClientPermissions',
      match: (cmd) => Array.isArray(cmd.requiredClientPermissions) && cmd.requiredClientPermissions.length > 0,
      handler: async (interaction, cmd) => {
        if (!interaction.guild) {
          return { ok: false, reply: 'This command must be used in a server.' };
        }
        let botGuildMember = interaction.guild.members.me;
        if (!botGuildMember) {
          botGuildMember = await interaction.guild.members.fetch(interaction.client.user.id).catch(() => null);
        }
        if (!botGuildMember || !botGuildMember.permissions.has(cmd.requiredClientPermissions)) {
          return { ok: false, reply: 'I need additional permissions to run this command. Please grant the required permissions to the bot.' };
        }
        return { ok: true };
      }
    },
    {
      name: 'cooldown',
      match: (cmd) => Number.isFinite(cmd.cooldown) && cmd.cooldown > 0,
      handler: async (interaction, cmd) => {
        const userId = interaction.user.id;
        const commandName = command.data?.name || 'unknown';
        const timestamps = ensureUserMap(commandName);
        const cooldownMs = cmd.cooldown * 1000;
        const now = Date.now();

        const last = timestamps.get(userId) || 0;
        const expires = last + cooldownMs;
        if (now < expires) {
          return { ok: false, reply: `Please wait ${formatSeconds(expires - now)} before using \`/${commandName}\` again.` };
        }

        timestamps.set(userId, now);
        setTimeout(() => {
          const map = cooldowns.get(commandName);
          if (map) map.delete(userId);
        }, cooldownMs).unref?.();

        return { ok: true };
      }
    }
  ];

  for (const check of checks) {
    if (check.match(command)) {
      const res = await check.handler(interaction, command);
      if (!res.ok) return res;
    }
  }

  return { ok: true };
};
