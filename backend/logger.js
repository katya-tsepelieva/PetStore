const { createLogger, format, transports } = require('winston');

const logFormat = format.printf(({ timestamp, level, message }) => {
  return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
});

const logLevel = process.env.LOG_LEVEL || 'info';

const logger = createLogger({
  level: logLevel, 
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), 
    format.colorize(), 
    logFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }), 
    new transports.File({ filename: 'logs/combined.log' }) 
  ]
});

module.exports = logger;
