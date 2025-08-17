// express/services/healthService.js

function getHealth() {
  return { ok: true, uptime: process.uptime() };
}

function getStatus(client) {
  if (!client) return { ok: false, error: 'Bot client not available' };
  return {
    ok: true,
    status: 'online',
    guilds: client.guilds.cache.size,
    users: client.users.cache.size,
    uptime: client.uptime,
  };
}

module.exports = { getHealth, getStatus };
