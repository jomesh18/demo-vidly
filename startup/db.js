const logger = require('./logging');
const mongoose = require('mongoose');
const config = require('config');

// const uri = 'mongodb://127.0.0.1:27017/movies';
// const uri = "mongodb://127.0.0.1:27017/vidly?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.9 rs0";
module.exports = function() {
    mongoose.connect(config.get('uri'))
    .then(() => logger.info(`Connected to ${config.get('uri')}`));
}
