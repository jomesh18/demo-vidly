const express = require('express');
const router = express.Router();
const { validateRental, Rental } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const validate = require('../middleware/validate');

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.status(200).send(rentals);
});

router.post('/', validate(validateRental), async (req, res) => {
    // console.log(req.body);
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(404).send('No customer');

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(404).send('No movie');

    if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock');

    const session = await Rental.startSession();
    if (!session)
        return res
            .status(500)
            .send("Internal Server Error: Unable to start a database session.");
    session.startTransaction();
    try {
        const rental = new Rental({
            customer: {
                _id: customer._id,
                name: customer.name,
                phone: customer.phone
            },
            movie: {
                _id: movie._id,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate
            }
        });
        await rental.save({ session });
        movie.numberInStock--;
        await movie.save({ session });
        await session.commitTransaction();
        res.status(200).send(rental);
    }
    catch (ex) {
        await session.abortTransaction();
        res.status(500).send(ex);
    } finally {
        session.endSession();
    }
});

module.exports = router;
