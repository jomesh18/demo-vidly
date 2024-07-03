const express = require('express');
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const router = express.Router();
const auth = require('../middleware/auth');
const { validateRental } = require('../models/rental');
const validate = require('../middleware/validate');

router.post('/', [auth, validate(validateRental)], async (req, res) => {
    // if (!req.body.customerId)
    //     return res.status(400).send('customerId is required');
    // if (!req.body.movieId)
    //     return res.status(400).send('movieId is required');
    
    // const rental = await Rental.findOne({ 
    //     'customer._id': req.body.customerId, 
    //     'movie._id': req.body.movieId
    //  });

    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);
    if (!rental)
        return res.status(404).send('No rental found');
    if (rental.dateReturned)
        return res.status(400).send('Rental already processed');
    rental.return();
    await rental.save();

    await Movie.findOneAndUpdate({_id: rental.movie._id}, { 
        $inc: { numberInStock: 1 } 
    });
        
    res.status(200).send(rental);
    
});

module.exports = router;