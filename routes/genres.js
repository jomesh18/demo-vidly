const express = require('express');
const router = express.Router();
const { Genre, validateGenre } = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', async (req, res) => {
    // throw new Error('Could not get genre');
    const genres = await Genre.find({});
    res.status(200).send(genres);
});

router.get('/:id', validateObjectId, async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send('The genre with given id is not found');
    res.status(200).send(genre);
});

router.post('/', auth, async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = new Genre( { name: req.body.name });
    await genre.save();
    res.status(200).send(genre);
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