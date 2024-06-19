const express = require("express");
const genres = require('./routes/genres');
const home = require('./routes/home');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

const uri = 'mongodb://127.0.0.1:27017/movies';
// const uri = "mongodb://127.0.0.1:27017/vidly?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.9 rs0";
mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Count not connect to MongoDB', err));

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', home);
app.use('/api/vidly/genres', genres);
app.use('/api/vidly/customers', customers);
app.use('/api/vidly/movies', movies);
app.use('/api/vidly/rentals', rentals);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});
