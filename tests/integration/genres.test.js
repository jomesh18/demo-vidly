const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');

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
});
