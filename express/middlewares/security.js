const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');

module.exports = function applySecurity(app) {
  app.use(helmet());
  app.use(compression());
  app.use(bodyParser.json({ limit: '1mb' }));
  app.use(bodyParser.urlencoded({ extended: true }));
};
