const express = require('express');
const router = express.Router();
const { Genre, validateGenre } = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', async (req, res) => {
    throw new Error('Could not get genre');
    const genres = await Genre.find({});
    res.status(200).send(genres);
});

router.get('/:id', (req, res) => {
    Genre.findById(req.params.id)
        .then(result => res.status(200).send(result))
        .catch(err => res.status(400).send(err));
});

router.post('/', auth, (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    Genre.create({ name: req.body.name })
        .then(course => res.status(200).send(course))
        .catch(err => res.status(400).send(err));
});

router.put('/:id', async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const genre = await Genre.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!genre) return res.status(404).send('Genre with this id is not found');
        res.status(200).send(genre);
    }
    catch (ex) {
        res.status(400).send(ex);
    }
});

router.delete('/:id', [auth, admin], (req, res) => {
    Genre.findByIdAndDelete(req.params.id)
        .then(result => res.status(200).send(result))
        .catch(err => res.status(400).send(err));
});

module.exports = router;