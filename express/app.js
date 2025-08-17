const express = require('express');
const { apiPrefix } = require('./config');
const applySecurity = require('./middlewares/security');
const createHealthRouter = require('./routes/health.router');
const createGuildRouter = require('./routes/guild.router');

function createApp(client) {
  const app = express();

  // Attach discord client to req
  app.use((req, _res, next) => {
    req.client = client;
    next();
  });

  // Middlewares
  applySecurity(app);

  // Routes
  app.use(apiPrefix, createHealthRouter());
  app.use(apiPrefix, createGuildRouter());

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ ok: false, error: 'Not Found' });
  });

  // Error handler
  app.use((err, _req, res, _next) => {
    // Ideally hook up to centralized logger
    console.error(err);
    res.status(500).json({ ok: false, error: 'Internal Server Error' });
  });

  return app;
}

module.exports = { createApp };
