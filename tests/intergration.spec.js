'use strict';

const request = require('supertest');
const { sequelize } = require('../models');
const Contact = require('../models').Contact;
const server = require('../app');
const constants = require('../helpers/constants');

describe('Tests for SMS API', () => {
  beforeEach(async () => await sequelize.sync({
    force: true,
    logging: false,
  }));

  afterAll(() => {
    server.close();
  });

  describe('Test contacts', () => {
    test('should fail to delete a contact that is not found', () => {
      request(server)
          .delete(`${constants.API_V1_BASE_URL}/1`)
          .expect(404)
    });

    test('should delete a contact', async () => {
      try {
        await Contact.create({
          name: 'John K',
          phoneNumber: '0789563730'
        });
        await request(server)
            .delete(`${constants.API_V1_BASE_URL}/1`)
            .expect(200)
            .then(res => {
              expect(res.body.status).toBe('success');
              expect(res.body.message).toBe('Contact has been deleted together with all the messages it references');
            })
      } catch (e) {
        console.log(`Error occurred while executing test ${e.message}`)
      }
    });

    test('should list contacts', () => {
      request(server)
          .get(`${constants.API_V1_BASE_URL}/contacts`)
          .expect(200)
          .then(res => {
            expect(res.body.status).toBe('success');
            expect(res.body.data).toBeDefined();
          })
    });

    test('should not allow empty request body to be empty', () => {
      request(server)
          .post(`${constants.API_V1_BASE_URL}/contacts`)
          .send({})
          .expect(400)
          .then(res => {
            expect(res.body.message).toContain('Contact validation failed')
          })
    });

    test('should not allow partial request body to be empty', () => {
      request(server)
          .post(`${constants.API_V1_BASE_URL}/contacts`)
          .send({
            name: 'John Kagga'
          })
          .expect(400)
          .then(res => {
            expect(res.body.message).toContain('Contact validation failed')
          })
    });

    test('should create a new contact', () => {
      request(server)
          .post(`${constants.API_V1_BASE_URL}/contacts`)
          .send({
            name: 'John Kagga',
            phoneNumber: '07896567848'
          })
          .expect(201)
          .then(res => {
            expect(res.body.message).toBe('Contact successfully created')
            expect(res.body.data).toMatchObject({
              id: expect.any(Number),
              name: expect.any(String),
              phoneNumber: expect.any(String),
              updatedAt: expect.any(String),
              createdAt: expect.any(String),
            })
          })
    });
  })
});