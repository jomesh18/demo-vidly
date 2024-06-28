const express = require('express');
const router = express.Router();
// const auth = require('../middleware/auth');

router.post('/', (req, res) => {
    res.status(401).send('Unauthorised');
});

module.exports = router;