const winston = require('winston');

const logger = winston.createLogger({
  level: 'error', // Log only errors and above
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

module.exports = logger;