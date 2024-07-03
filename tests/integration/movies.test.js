const request = require('supertest');
const { Movie } = require('../../models/movie');
const mongoose = require('mongoose');
const { User } = require('../../models/user');
const { Genre } = require('../../models/genre');

describe('api/vidly/movies', () => {
    let server;
    let movie1;
    let movie2;
    let genre1;
    let token;
    let movie3;
    beforeEach(async () => {
        server = require('../../index');
        genre1 = new Genre({ name: 'abcde' });
        await genre1.save();
        movie1 = new Movie({ title: '12345', genre: { name: '12345' }, numberInStock: 5, dailyRentalRate: 2});
        await movie1.save();
        movie2 = new Movie({ title: '123456', genre: { name: '123456' }, numberInStock: 5, dailyRentalRate: 2});
        await movie2.save();
        
        movie3 = { title: '1234567', genreId: genre1._id, numberInStock: 5, dailyRentalRate: 2};
    });
    afterEach(async () => {
        await server.close();
        await Movie.deleteMany();
        await Genre.deleteMany();
    });

    describe('GET /', () => {
        it('should return all movies', async () => {

            const res = await request(server).get('/api/vidly/movies');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(m => m.title==='12345')).toBeTruthy();
            expect(res.body.some(m => m.title==='123456')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return 404 if invalid id is sent', async () => {
            const res = await request(server).get('/api/vidly/movies/1');
            expect(res.status).toBe(404);
        });

        it('should return 404 if movie with given id doesnot exist', async () => {
            const id = new mongoose.Types.ObjectId();
            const res = await request(server).get('/api/vidly/movies/'+id);
            expect(res.status).toBe(404);
        });

        it('should return the movie with given id', async () => {
            const res = await request(server).get('/api/vidly/movies/'+movie1._id);
            expect(res.status).toBe(200);
            expect(res.body.title).toBe('12345');
        });
    });

    describe('POST /', () => {
        beforeEach(async () => {
            token = new User().generateAuthToken();
        })
        const exec = function() {
            return request(server)
                .post('/api/vidly/movies')
                .set('x-auth-token', token)
                .send(movie3);
        }

        it('should return 401 if token is not provided', async () => {
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        });

        it('should return 400 if movie is invalid', async () => {
            movie3.title = '';
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is invalid', async () => {
            movie3.genreId = new mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 200 if everything is good', async () => {
            const res = await exec();
            expect(res.status).toBe(200);
        });
    });

    describe('PUT /:id', () => {
        let id;
        beforeEach(async () => {
            id = movie1._id;
            token = new User({ _id: new mongoose.Types.ObjectId().toHexString(), isAdmin: true }).generateAuthToken();
        })
        const exec = function() {
            return request(server)
                .put('/api/vidly/movies/'+id)
                .set('x-auth-token', token)
                .send(movie3);
        }

        it('should return 401 if token is not provided', async () => {
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        });

        it('should return 403 if user is not admin', async () => {
            token = new User().generateAuthToken();
            const res = await exec();
            expect(res.status).toBe(403);
        });

        it('should return 400 if genre is invalid', async () => {
            movie3.genreId = new mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if movie is invalid', async () => {
            id = new mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(400);
            expect(res.text).toMatch('Invalid movie');
        });

        it('should return 200 if everything is good', async () => {
            const res = await exec();
            expect(res.status).toBe(200);
            // expect(res.body).toHaveProperty('title', '1234567');
            expect(Object.keys(res.body)).toEqual(
                expect.arrayContaining(['title', 'genre', 'numberInStock', 'dailyRentalRate'])
            )
        });
    });

    describe('DELETE /:id', () => {
        let id;
        const exec = () => {
            return request(server)
                .delete('/api/vidly/movies/'+id)
                .set('x-auth-token', token);
        }

        it('should return 404 if movie not found', async () => {
            id = new mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(404);
        });

        it('should return 200 if movie is deleted', async () => {
            id = movie1._id;
            const res = await exec();
            expect(res.status).toBe(200);
        });
    });
});