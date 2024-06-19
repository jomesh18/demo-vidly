const express = require('express');
const router = express.Router();
const { Movie, validateMovie } = require('../models/movie');
const { Genre } = require('../models/genre');

router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.status(200).send(movies);
    }
    catch (ex){
        res.status(400).send(ex);
    }
});

router.post('/', async (req, res) => {
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) res.status(400).send('Invalid genre');

    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    await movie.save();
    res.status(200).send(movie);
});

router.put('/:id', async (req, res) => {
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) res.status(400).send('Invalid genre');

    const movie = await Movie.findById(req.params.id);
    if (!movie) res.status(400).send('Invalid movie');
    movie.title = req.body.title,
    movie.genre = {
        _id: genre._id,
        name: genre.name 
    };
    movie.numberInStock = req.body.numberInStock,
    movie.dailyRentalRate = req.body.dailyRentalRate
    const result = await movie.save();
    if (!res) return res.status(400).send(result);
    res.status(200).send(result);
});

router.delete('/:id', async (req, res) => {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).send('No movie with given id');
    res.status(200).send(movie);
});

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send('Movie not found');
    res.status(200).send(movie);
});

module.exports = router;