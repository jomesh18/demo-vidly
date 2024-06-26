const logger = require('./logging');
const mongoose = require('mongoose');

const uri = 'mongodb://127.0.0.1:27017/movies';
// const uri = "mongodb://127.0.0.1:27017/vidly?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.9 rs0";
module.exports = function() {
    mongoose.connect(uri)
    .then(() => logger.info('Connected to MongoDB'));
}
