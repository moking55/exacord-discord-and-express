const { Router } = require('express');
const { getGuilds } = require('../services/discord.service');

module.exports = function createGuildRouter() {
  const router = Router();

  router.get('/guilds', (req, res) => {
    // This route could be used to fetch guilds information
    res.status(200).json(getGuilds(req.client));
  });

  return router;
};
