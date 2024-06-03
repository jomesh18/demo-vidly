const express = require("express");
const Joi = require('joi');

const app = express();

app.use(express.json());

let genres = [{'name': 'action', 'id': 1}, {'name': 'romance', 'id': 2}, {'name': 'comedy', id: 3}, {'name': 'thriller', 'id': 3}, {'name': 'horror', 'id': 4}];

app.get('/', (req, res) => {
    return res.status(200).send('Vidly store');
});

app.get('/api/vidly/genres', (req, res) => {
    return res.status(200).send(genres);
});

app.get('/api/vidly/genres/:id', (req, res) => {
    const genre = genres.find((c) => req.params.id == c.id);
    if (!genre) return res.status(404).send('Not found');
    return res.status(200).send(genre);
});

app.post('/api/vidly/genres', (req, res) => {
    const { error } = validate_genre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const id = genres.length+1
    const genre = {id: id, name: req.body.name};
    genres.push(genre);
    return res.status(200).send(genre);
});

app.put('/api/vidly/genres/:id', (req, res) => {
    const genre = genres.find((c) => req.params.id == c.id);
    if (!genre) return res.status(404).send('Not found');

    const { error } = validate_genre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    genre.name = req.body.name;
    return res.status(200).send(genre);
});

app.delete('/api/vidly/genres/:id', (req, res) => {
    const genre = genres.find((c) => req.params.id == c.id);
    if (!genre) return res.status(404).send('Not found');

    let i = genres.indexOf(genre);
    genres.splice(i, 1);
    return res.status(200).send(genre);
});


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});

const validate_genre = (genre) => {
    const schema = Joi.object({
        name: Joi.string().
        alphanum()
        .min(3)
        .required()
    });
    return schema.validate(genre);
}