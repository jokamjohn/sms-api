'use strict';

const request = require('supertest');
const Contact = require('../models').Contact;
const server = require('../app');
const app = request(server);
const truncate = require('./truncate');
const constants = require('../helpers/constants');
const MessageController = require('../controllers/message');
const ContactController = require('../controllers/contact');


describe('Tests for SMS API', () => {
  afterAll(async () => {
    await truncate();
    server.close();
  });

  describe('Test contacts', () => {
    test('should fail to delete a contact that is not found', () => {
      app.delete(`${constants.API_V1_BASE_URL}/1`)
          .expect(404)
    });

    test('should delete a contact', async () => {
      try {
        await Contact.create({
          name: 'John K',
          phoneNumber: '0789563730'
        });
        await app.delete(`${constants.API_V1_BASE_URL}/1`)
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
      app.get(`${constants.API_V1_BASE_URL}/contacts`)
          .expect(200)
          .then(res => {
            expect(res.body.status).toBe('success');
            expect(res.body.data).toBeDefined();
          })
    });

    test('should not allow empty request body to be empty', () => {
      app.post(`${constants.API_V1_BASE_URL}/contacts`)
          .send({})
          .expect(400)
          .then(res => {
            expect(res.body.message).toContain('Contact validation failed')
          })
    });

    test('should not allow partial request body to be empty', () => {
      app.post(`${constants.API_V1_BASE_URL}/contacts`)
          .send({
            name: 'John Kagga'
          })
          .expect(400)
          .then(res => {
            expect(res.body.message).toContain('Contact validation failed')
          })
    });

    test('should create a new contact', () => {
      app.post(`${constants.API_V1_BASE_URL}/contacts`)
          .send({
            name: 'John Kagga',
            phoneNumber: '07896567848'
          })
          .expect(201)
          .then(res => {
            expect(res.body.message).toBe('Contact successfully created');
            expect(res.body.data).toMatchObject({
              id: expect.any(Number),
              name: expect.any(String),
              phoneNumber: expect.any(String),
              updatedAt: expect.any(String),
              createdAt: expect.any(String),
            })
          });
    });
  });

  describe('Test Messages', () => {
    test('should fail to create message on empty payload', () => {
      app.post(`${constants.API_V1_BASE_URL}/contacts/1/sms`)
          .expect(400)
          .then(res => {
            expect(res.body.status).toBe('failed');
            expect(res.body.message).toContain('Message validation failed');
          });
    });

    test('should fail to get a list of received messages', () => {
      app.get(`${constants.API_V1_BASE_URL}/contacts/1/received/sms`)
          .expect(400)
          .then(res => {
            expect(res.body.status).toBe('failed');
            expect(res.body.message).toBe('Provide a contact Id');
          })
    });

    test('should fail to get a list sent messages', () => {
      app.get(`${constants.API_V1_BASE_URL}/contacts/1/sent/sms`)
          .expect(400)
          .then(res => {
            expect(res.body.status).toBe('failed');
            expect(res.body.message).toBe('Provide a contact Id');
          })
    });

    test('should fail deleting a message', () => {
      app.delete(`${constants.API_V1_BASE_URL}/contacts/1/sms/2`)
          .expect(400)
          .then(res => {
            expect(res.body.status).toBe('failed');
            expect(res.body.message).toBe('Contact Id or message Id is missing');
          })
    });
  });

  describe('Test Listing messages', () => {
    let contactId;
    beforeAll(async () => {
      const res = await ContactController.createContact({
        request: {
          body: {
            name: 'John kagga',
            phoneNumber: '0789534567'
          }
        }
      });
      contactId = res.data.dataValues.id;
      await MessageController.createMessage({
        request: {
          body: {
            text: 'Test message',
            receiverId: contactId
          }
        },
        params: {
          contactId
        }
      })
    });

    test('should list sent messages', () => {
      app.get(`${constants.API_V1_BASE_URL}/contacts/${contactId}/sent/sms`)
          .expect(200)
          .then(res => {
            expect(res.body.status).toBe('success');
            expect(res.body.message).toBe(`Successfully returned messages sent by a contact with Id ${contactId}`);
          })
    });

    test('should list received messages', () => {
      app.get(`${constants.API_V1_BASE_URL}/contacts/${contactId}/received/sms`)
          .expect(200)
          .then(res => {
            expect(res.body.status).toBe('success');
            expect(res.body.message).toBe(`Successfully returned messages received by a contact with Id ${contactId}`);
          })
    });

    test('should create a message', () => {
      app.post(`${constants.API_V1_BASE_URL}/${contactId}/sms`)
          .send({
            text: 'Test message',
            receiverId: contactId
          })
          .expect(201)
          .then(res => {
            expect(res.body.status).toBe('Success');
            expect(res.body.message).toBe('Message sent successfully');
          });
    });

  });
});