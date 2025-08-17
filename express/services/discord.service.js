
function getGuilds(client) {
  if (!client || !client.guilds) {
    throw new Error('Invalid client provided');
  }

  return client.guilds.cache.map(guild => ({
    id: guild.id,
    name: guild.name,
    icon: guild.iconURL(),
    memberCount: guild.memberCount
  }));
}

module.exports = {
  getGuilds
};