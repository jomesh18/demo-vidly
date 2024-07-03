const express = require('express');
const router = express.Router();
const { Genre, validateGenre } = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const validate = require('../middleware/validate');

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

router.post('/', [auth, validate(validateGenre)], async (req, res) => {

    const genre = new Genre( { name: req.body.name });
    await genre.save();
    res.status(200).send(genre);
});

router.put('/:id', [auth, validate(validateGenre)], async (req, res) => {

    const genre = await Genre.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!genre) return res.status(404).send('Genre with this id is not found');
    res.status(200).send(genre);
});

router.delete('/:id', [auth, admin], async (req, res) => {
    const genre = await Genre.findByIdAndDelete(req.params.id);
    if (!genre) return res.status(404).send('Genre with this id not found');
    res.status(200).send(genre);
});

module.exports = router;