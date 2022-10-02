import request from 'supertest';
import IntegrationHelpers from '../helpers/integrationn-helpers.js';
import * as express from 'express';
import DB from '../../db/index.js';

const testData = [
    {
        "email": "my@email",
        "name": "Admin 1",
        "role": "admin",
        "id": 9415
    },
    {
        "email": "your@email",
        "name": "Guest 1",
        "role": "guest",
        "id": 720
    },
    {
        "email": "test@email",
        "name": "Dummy 3",
        "role": "admin",
        "id": 1265
    },
    {
        "email": "test@email",
        "name": "Dummy 2",
        "role": "admin",
        "id": 935
    },
    {
        "email": "test@email",
        "name": "Dummy 1",
        "role": "admin",
        "id": 799
    }
];

describe('Test User API Endpoints', () => {
    let app: express.Application;
    beforeAll(async () => {
        app = await IntegrationHelpers.getApp();

        testData.forEach((user) => {
            DB.instance.data!.users.push(user);
        });

        await DB.instance.write();
    });

    describe('GET /users', () => {
        it('should return all users', async () => {
            const response = await request(app)
                .get('/users');

            expect(response.statusCode).toEqual(200);
            expect(response.body.length).toEqual(testData.length);
        });
    });

    describe('GET /users/:id', () => {
        it('should return a user', async () => {
            const testUser = testData[1];
            const response = await request(app)
                .get(`/users/${testUser.id}`);

            expect(response.statusCode).toEqual(200);
            expect(response.body.id).toEqual(testUser.id);
            expect(response.body.name).toEqual(testUser.name);
        });

        it('should fail with status code 400 if id is not a number', async () => {
            const testUser = testData[1];
            const response = await request(app)
                .get(`/users/jdhjxchh`);

            expect(response.statusCode).toEqual(400);
        });

        it('should fail with status code 404 if id not exist in DB', async () => {
            const testUser = testData[1];
            const response = await request(app)
                .get(`/users/123456`);

            expect(response.statusCode).toEqual(404);
        });
    });

    describe('POST /users', () => {
        it('should create a new user', async () => {
            const testUser = {
                name: "New Dummy",
                email: "123@email.com",
                role: "guest"
            };

            await request(app)
                .post(`/users`)
                .set('Content-Type', 'application/json')
                .send(testUser)
                .expect(201);
        });

        it('should fail with status code 400 if request body is not valid.', async () => {
            await request(app)
                .post(`/users`)
                .set('Content-Type', 'application/json')
                .send({})
                .expect(400);
        });
    });

    describe('PUT /users/:id', () => {
        it('should update existing user', async () => {
            const testUser = testData[0];

            await request(app)
                .put(`/users/${testUser.id}`)
                .set('Content-Type', 'application/json')
                .send({
                    name: "Jhake Inson",
                    role: "admin"
                })
                .expect(200);
        });

        it('should fail with status code 400 if request body is not valid.', async () => {
            const testUser = testData[0];
            await request(app)
                .put(`/users/${testUser.id}`)
                .set('Content-Type', 'application/json')
                .send({})
                .expect(400);
        });

        it('should fail with status code 404 if id does not exist.', async () => {
            const testUser = testData[0];
            await request(app)
                .put(`/users/12345`)
                .set('Content-Type', 'application/json')
                .send({
                    name: "dfjdhj"
                })
                .expect(404);
        });
    });

    describe('DELETE /users/:id', () => {
        it('should delete a user', async () => {
            const testUser = testData[0];

            await request(app)
                .delete(`/users/${testUser.id}`)
                .expect(200);
        });

        it('should fail with status code 400 if id is not valid.', async () => {
            const testUser = testData[0];
            await request(app)
                .delete(`/users/dcvvdfc`)
                .expect(400);
        });

        it('should return status code 200 if no user is deleted.', async () => {
            await request(app)
                .delete(`/users/12345`)
                .expect(200);
        });
    });

});
