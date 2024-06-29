const request = require('supertest');
const mongoose = require('mongoose');
const { Rental } = require('../../models/rental');
const { User } = require('../../models/user');
// const dayjs = require('dayjs');

describe('api/vidly/returns', () => {
    let server;
    let customerId;
    let movieId;
    let rental;
    let token;

    beforeEach(async () => {
        server = require('../../index');

        customerId = new mongoose.Types.ObjectId();
        movieId = new mongoose.Types.ObjectId();
        token = new User().generateAuthToken();
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

    const exec = function(){
        return request(server)
            .post('/api/vidly/returns')
            .set('x-auth-token', token)
            .send({customerId: customerId, movieId: movieId })
    };


    // Return 401 if client is not logged in
    it('should return 401 if client is not logged in', async () => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });

    // Return 400 if customerId is not provided
    it('should return 400 if customerId is not given', async () => {
        customerId = '';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    // Return 400 if movieId is not provided
    it('should return 400 if movieId is not given', async () => {
        movieId = '';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    // Return 404 if no rental found for this customer/movie
    it('should return 404 if no rental found for this customer/movie', async ()=>{
        await Rental.deleteMany();
        const res = await exec();
        expect(res.status).toBe(404);
    });

    // Return 400 if rental already processed
    it('should return 400 if rental already processed', async ()=>{
        rental.dateReturned = new Date();
        await rental.save();
        const res = await exec();
        expect(res.status).toBe(400);
    });

    // Return 200 if valid request
    it('should return 200 if request is valid', async ()=>{
        const res = await exec();
        expect(res.status).toBe(200);
    });

    // Set the return date
    it('should set the return date', async ()=>{
        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDb.dateReturned;
        expect(diff).toBeLessThan(10*1000);
    });

    // Calculate the rental fee
    // it('should set the rental fee', async ()=>{
    //     rental.dateOut = new dayjs().subtract(7, 'day').toDate();
    //     const res = await exec();
    //     const rentalInDb = await Rental.findById(rental._id);
    //     const fee = (rentalInDb.dateReturned.getDate()-rentalInDb.dateOut.getDate()) * rentalInDb.dailyRentalRate;
    //     expect(rentalInDb.rentalFee).toBe(fee);
    // });

    // Increase the stock
    // Return rental
});
