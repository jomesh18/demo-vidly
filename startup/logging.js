const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

const logger = winston.createLogger({
    transports: [
      new winston.transports.File({ filename: 'logfile.log' }),
      new winston.transports.MongoDB({db: 'mongodb://127.0.0.1:27017/movies', options: {useNewUrlParser: true, useUnifiedTopology: true}, level: 'error'})
    ],
    exceptionHandlers: [
      new winston.transports.Console( {
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      }),
      new winston.transports.File({ filename: 'uncaughtExceptions.log' })
    ]
  });

module.exports = logger;
