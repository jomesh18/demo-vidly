const express = require("express");
require('express-async-errors');
const genres = require('./routes/genres');
const home = require('./routes/home');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const config = require('config');
const mongoose = require('mongoose');
const error = require('./middleware/error');
const winston = require('winston');
require('winston-mongodb');
const app = express();

winston.add(new winston.transports.File({ filename: 'logfile.log' }));
winston.add(new winston.transports.MongoDB({db: 'mongodb://127.0.0.1:27017/movies', options: {useNewUrlParser: true, useUnifiedTopology: true}}));

process.on('uncaughtException', (ex) =>{
    console.log("UNCAUGHT EXCEPTION");
    winston.error(ex.message, ex);
});

throw new Error('something failed on startup');

if (!config.get('jwtPrivateKey')) {
    console.log('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}

const uri = 'mongodb://127.0.0.1:27017/movies';
// const uri = "mongodb://127.0.0.1:27017/vidly?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.9 rs0";
mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Count not connect to MongoDB', err));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', home);
app.use('/api/vidly/genres', genres);
app.use('/api/vidly/customers', customers);
app.use('/api/vidly/movies', movies);
app.use('/api/vidly/rentals', rentals);
app.use('/api/vidly/users', users);
app.use('/api/vidly/auth', auth);

app.use(error);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});
