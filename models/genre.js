const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

const Genre = mongoose.model('Genre', genreSchema);

const validateGenre = (genre) => {
    const schema = Joi.object({
        name: Joi.string().alphanum().min(5).max(50).required()
    });
    return schema.validate(genre);
}

module.exports = {
    Genre,
    validateGenre,
    genreSchema
};