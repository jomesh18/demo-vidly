const express = require("express");
require('express-async-errors');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const config = require('config');
const winston = require('winston');
require('winston-mongodb');
const app = express();
require('./startup/routes')(app);
require('./startup/db')();

winston.add(new winston.transports.File({ filename: 'logfile.log' }));
winston.add(new winston.transports.MongoDB({db: 'mongodb://127.0.0.1:27017/movies', options: {useNewUrlParser: true, useUnifiedTopology: true}}));

// process.on('uncaughtException', (ex) =>{
//     winston.error(ex.message, ex);
//     process.exit(1);
// });

// process.on('unhandledRejection', (ex) =>{
//     winston.error(ex.message, ex);
//     process.exit(1);
// });

winston.exceptions.handle(new winston.transports.File({ filename: 'uncaughtExceptions.log'}));

// throw new Error('something failed on startup');

// const p = Promise.reject(new Error('something failed'));
// p.then(() => console.log('Done'));

if (!config.get('jwtPrivateKey')) {
    console.log('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});
