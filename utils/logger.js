const winston = require('winston');
const util = require('util');

const { combine, timestamp, printf, colorize, errors, splat } = winston.format;

const prettyFormat = printf(({ timestamp, level, message, stack, ...meta }) => {
  const msg = stack || message;
  const metaKeys = Object.keys(meta || {});
  const metaStr = metaKeys.length ? ` ${util.inspect(meta, { depth: 4, colors: false })}` : '';
  return `${timestamp} [${level}] ${msg}${metaStr}`;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'debug',
  format: combine(
    errors({ stack: true }), // capture stack trace for errors
    splat(), // support printf-style %s interpolation
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    colorize({ all: true }),
    prettyFormat
  ),
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      stderrLevels: ['error', 'warn'],
    }),
  ],
  exitOnError: false,
});

module.exports = { logger };
