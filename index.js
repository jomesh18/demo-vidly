const express = require("express");

const app = express();

let genres = [['action', 'romance', 'comedy', 'thriller', 'horror']];

app.get('/', (req, res) => {
    return res.send('Vidly store');
    
});

app.get('/api/vidly/genres', (req, res) => {
    return res.send(genres);
});

app.get('/api/vidly/genres/:id', (req, res) => {
    
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});