const request = require('supertest');
const { Genre } = require('../../models/genre');
let server;

describe('testing authorisation middleware', () => {
    beforeEach(() => {
        server = require('../../index');
    });
    afterEach(() => {
        server.close();
    });

    const exec = () => {
        return request(server).post('/api/vidly/genres').send({ name: 'genre1'});
    }
    describe('no token provided', () => {
        it('should return 401 error if no token is provided', () => {
            const res = request(server).post('/api/vidly/auth');
            return 
        });
    });

});