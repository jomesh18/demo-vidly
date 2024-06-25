const express = require('express');
const genres = require('../routes/genres');
const home = require('../routes/home');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/error');

module.exports = function(app) {
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
}
