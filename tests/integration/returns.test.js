const request = require('supertest');
const mongoose = require('mongoose');
const { Rental } = require('../../models/rental');

describe('api/vidly/returns', () => {
    let server;
    let customerId;
    let movieId;
    let rental;

    beforeEach(async () => {
        server = require('../../index');

        customerId = new mongoose.Types.ObjectId();
        movieId = new mongoose.Types.ObjectId();
        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2
            }
        });
        await rental.save();
    });
    
    afterEach(async () => {
        await server.close();
        await Rental.deleteMany();
    });

    it('should work', async () => {
        const result = await Rental.findById(rental._id);
        expect(result).not.toBeNull();
    });


    // Return 401 if client is not logged in
    it('should return 401 if client is not logged in', async () => {
        const res = await request(server)
            .post('/api/vidly/returns')
            .send({customerId: customerId, movieId: movieId });
        expect(res.status).toBe(401);
    });
    // Return 400 if customerId is not provided
    // Return 400 if movieId is not provided
    // Return 404 if no rental found for this customer/movie
    // Return 400 if rental already processed
    // Return 200 if valid request
    // Set the return date
    // Calculate the rental fee
    // Increase the stock
    // Return rental
});
