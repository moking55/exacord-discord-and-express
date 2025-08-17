const { Router } = require('express');
const { getHealth, getStatus } = require('../services/health.service');

module.exports = function createHealthRouter() {
  const router = Router();

  router.get('/health', (_req, res) => {
    res.status(200).json(getHealth());
  });

  router.get('/status', (req, res) => {
    const payload = getStatus(req.client);
    const code = payload.ok ? 200 : 503;
    res.status(code).json(payload);
  });

  return router;
};
