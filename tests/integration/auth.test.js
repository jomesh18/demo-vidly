const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');
let server;

describe('testing authorisation middleware', () => {
    let token;
    let name;
    beforeEach(() => {
        server = require('../../index');
        token = new User().generateAuthToken();
        name = 'genre1';
    });
    afterEach(async () => {
        server.close();
        await Genre.deleteMany();
    });

    const exec = () => {
        return request(server)
                .post('/api/vidly/genres')
                .set('x-auth-token', token)
                .send({ name: name});
    }

    describe('no token provided', () => {
        it('should return 401 error if no token is provided', async () => {
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        });
    });

    describe('token is invalid', () => {
        it('should return 400 error token is invalid', async () => {
            token = '1';
            const res = await exec();
            expect(res.status).toBe(400);
        });
    });

    describe('token is valid', () => {
        it('should return 200', async () => {
            const res = await exec();
            expect(res.status).toBe(200);
        });
    });


});