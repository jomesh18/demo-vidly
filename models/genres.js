const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    }
});

const Genre = mongoose.model('Genre', genreSchema);

const validate_genre = (genre) => {
    const schema = Joi.object({
        name: Joi.string()
        .alphanum()
        .min(3)
        .required()
    });
    return schema.validate(genre);
}

module.exports = { 
    Genre,
    validate_genre
};