const mongoose = require('mongoose');
const Joi = require('joi');
const dayjs = require('dayjs');

const rentalSchema = mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true
            },
            isGold: {
                type: Boolean,
                default: false,
            },
            phone: {
                type: String,
                required: true
            }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});

rentalSchema.statics.lookup = function(customerId, movieId) {
    return this.findOne({ 
        'customer._id': customerId, 
        'movie._id': movieId
     });
}

rentalSchema.methods.return = function() {
    this.dateReturned = new Date();

    const diff = dayjs().diff(dayjs(this.dateOut), 'day');
    this.rentalFee = diff * this.movie.dailyRentalRate;
}

const Rental = mongoose.model('Rental', rentalSchema);

const validateRental = (rental) => {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required(),
    });
    return schema.validate(rental);
}

module.exports = {
    Rental,
    validateRental
};