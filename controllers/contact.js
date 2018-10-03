'use strict';

const Joi = require('joi');
const Contact = require('../models').Contact;
const Validator = require('../helpers').validator;

class ContactController {
  static async createContact(ctx) {
    const { error, value } = Joi.validate(ctx.request.body, Validator.contactValidator.contactSchema);
    if (error) {
      ctx.status = 400;
      return ctx.body = {
        status: 'failed',
        message: `Contact validation failed ${error.message}`
      }
    }

    try {
      const contact = await Contact.create({
        name: value.name,
        phoneNumber: value.phoneNumber
      });

      ctx.status = 201;
      return ctx.body = {
        status: 'success',
        data: contact,
        message: "Contact successfully created"
      }
    } catch (err) {
        ctx.status = 400;
        return ctx.body = {
          status: 'failed',
          message: `Failed to save contact ${err.message}`
        }
    }
  }
}

module.exports = ContactController;