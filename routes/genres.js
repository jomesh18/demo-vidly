const express = require('express');
const router = express.Router();
const Joi = require('joi');
const mongoose = require('mongoose');

// let genres = [{'name': 'action', 'id': 1}, {'name': 'romance', 'id': 2}, {'name': 'comedy', id: 3}, {'name': 'thriller', 'id': 3}, {'name': 'horror', 'id': 4}];

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    }
});

const Genre = mongoose.model('Genre', genreSchema);

router.get('/', (req, res) => {
    Genre.find({})
        .then(result => res.status(200).send(result))
        .catch(err=> res.status(400).send(err));
});

router.get('/:id', (req, res) => {
    Genre.findById(req.params.id)
        .then(result => res.status(200).send(result))
        .catch(err => res.status(400).send(err));
});

router.post('/', (req, res) => {
    const { error } = validate_genre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    Genre.create({name: req.body.name})
        .then(course=>res.status(200).send(course))
        .catch(err=> res.status(400).send(err));
    
});

router.put('/:id', async (req, res) => {
    const { error } = validate_genre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try{
        const genre = await Genre.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if (!genre) return res.status(404).send('Genre with this id is not found');
        res.status(200).send(genre);
    }
    catch (ex){
        res.status(400).send(ex);
    }
    
    
});

router.delete('/:id', (req, res) => {
    Genre.findByIdAndDelete(req.params.id)
        .then(result => res.status(200).send(result))
        .catch(err => res.status(400).send(err));
});

const validate_genre = (genre) => {
    const schema = Joi.object({
        name: Joi.string()
        .alphanum()
        .min(3)
        .required()
    });
    return schema.validate(genre);
}

module.exports = router;