const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');
const mongoose = require('mongoose');

let server;

describe('/api/vidly/genres', () => {
    beforeEach(() => { server = require('../../index'); });
    afterEach(async () => { 
        server.close(); 
        await Genre.deleteMany();
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.insertMany([
                {name: 'genre1'},
                {name: 'genre2'}
            ]);
            const res = await request(server).get('/api/vidly/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some((g) => g.name=='genre1')).toBeTruthy();
            expect(res.body.some((g) => g.name=='genre2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return 404 if an invalid genre id is sent', async () => {
            const res = await request(server).get('/api/vidly/genres/1');
            expect(res.status).toBe(404);
        });

        it('should return 404 if no genre with given id exists', async () => {
            const id = new mongoose.Types.ObjectId();
            const res = await request(server).get('/api/vidly/genres/'+ id);
            expect(res.status).toBe(404);
        });

        it('should return the genre with the given id', async () => {
            let genre = await Genre.create({name: 'genre1'});

            const res = await request(server).get('/api/vidly/genres/' + genre._id);
            expect(res.status).toBe(200);
            // expect(res.body.name).toMatch('genre1');
            expect(res.body).toHaveProperty('name', genre.name);
        });
    });

    // describe('POST /', () => {
    //     it('should return a 401 error if user is not logged in', async () => {
    //         const res = await request(server)
    //                 .post('/api/vidly/genres')
    //                 .send( { name: 'genre1' });
    //         expect(res.status).toBe(401);
    //     });

    //     it('should return a 400 error if name is less than 5 characters', async () => {
    //         const token = new User().generateAuthToken();
    //         const res = await request(server)
    //                     .post('/api/vidly/genres')
    //                     .set('x-auth-token', token)
    //                     .send( { name: '1234' });
    //         expect(res.status).toBe(400);
    //     });

    //     it('should return a 400 error if name is greater than 50 characters', async () => {
    //         const token = new User().generateAuthToken();
    //         const name = new Array(52).join('a');
    //         const res = await request(server)
    //                     .post('/api/vidly/genres')
    //                     .set('x-auth-token', token)
    //                     .send( { name: name });
    //         expect(res.status).toBe(400);
    //     });

    //     it('should save the genre if it is valid', async () => {
    //         const token = new User().generateAuthToken();
    //         const res = await request(server)
    //                     .post('/api/vidly/genres')
    //                     .set('x-auth-token', token)
    //                     .send( { name: 'genre1' });
    //         const genre = await Genre.findById(res.body._id);
    //         expect(genre).not.toBeNull();
    //     });

    //     it('should return the genre if it is valid', async () => {
    //         const token = new User().generateAuthToken();
    //         const res = await request(server)
    //                     .post('/api/vidly/genres')
    //                     .set('x-auth-token', token)
    //                     .send( { name: 'genre1' });
        
    //         expect(res.body).toHaveProperty('_id');
    //         expect(res.body).toHaveProperty('name', 'genre1');
    //     });
    // });


    describe('POST /', () => {
        // Refactoring tests
        // Define the happy path, and then in each test, we change 
        // one parameter that clearly aligns with the name of the 
        // test
        let token;
        let name;
        const exec = function() {
            return request(server)
                .post('/api/vidly/genres')
                .set('x-auth-token', token)
                .send( { name: name });
        }
        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre1';
        });

        it('should return a 401 error if user is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return a 400 error if name is less than 5 characters', async () => {
            name = '1234'

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return a 400 error if name is greater than 50 characters', async () => {
            name = new Array(52).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should save the genre if it is valid', async () => {
            await exec();

            const genre = await Genre.find({name: name});

            expect(genre).not.toBeNull();
        });

        it('should return the genre if it is valid', async () => {
            const res = await exec();
        
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });

    describe('PUT /:id', () => {
        let name;
        let genre;
        let token;
        beforeEach(async () => {
            token = new User().generateAuthToken();
            genre = await Genre.create({name: 'genre1'});
            name = 'genre2';
        });

        const exec = function() {
            return request(server)
                .put('/api/vidly/genres/' + genre._id)
                .set('x-auth-token', token)
                .send( { name: name });
        }

        it('should update the genre with given id to new name', async () => {
            const res = await exec();
            expect(res.body).toHaveProperty('_id', genre._id.toHexString());
            expect(res.body).toHaveProperty('name', name);
        });

        it('should send status 404 if the genre with given id is not found', async () => {
            genre._id = new mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(404);
        });

        it('should return a 400 error if name is less than 5 characters', async () => {
            name = '1234'

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return a 400 error if name is greater than 50 characters', async () => {
            name = new Array(52).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });
    });

    describe('DELETE /:id', () => {
        let token;
        let genre;
        let name;
        let user;
        beforeEach(async () => {
            name = 'genre1';
            genre = await Genre.create({name: name});
            user = { _id: new mongoose.Types.ObjectId().toHexString(), isAdmin: true };
            token = new User(user).generateAuthToken();
        });

        const exec = function() {
            return request(server)
                .delete('/api/vidly/genres/' +genre._id)
                .set('x-auth-token', token);
        }

        it('should delete the genre with given genre id if it is valid', async () => {
            const res = await exec();
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id', genre._id.toHexString());
        });

        it('should send status 404 if genre with given id is not found', async () => {
            genre._id = new mongoose.Types.ObjectId().toHexString();

            const res = await exec();
            expect(res.status).toBe(404);
        });

        it('should send status 403 if the user is not admin', async () => {
            user = { _id: new mongoose.Types.ObjectId().toHexString(), isAdmin: false };
            token = new User(user).generateAuthToken();

            const res = await exec();
            expect(res.status).toBe(403);
        });

    });
});
