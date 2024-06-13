const express = require("express");
const genres = require('./routes/genres');
const home = require('./routes/home');
const customers = require('./routes/customers');
const mongoose = require('mongoose');

const uri = 'mongodb://localhost/movies';
mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Count not connect to MongoDB', err));

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', home);
app.use('/api/vidly/genres', genres);
app.use('/api/vidly/customers', customers);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});
