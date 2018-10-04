'use strict';

const Joi = require('joi');
const Contact = require('../models').Contact;
const Message = require('../models').Message;
const Validator = require('../helpers').validator;

class ContactController {
  static async createContact(ctx) {
    const {error, value} = Joi.validate(ctx.request.body, Validator.contactValidator.contactSchema);
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

  static async deleteContact(ctx) {
    const contactId = ctx.params.contactId;
    if (!contactId) {
      ctx.status = 400;
      return ctx.body = {
        status: 'failed',
        message: 'Provide a contact Id'
      }
    }

    try {
      const contact = await Contact.findById(contactId);
      if (!contact) {
        ctx.status = 404;
        return ctx.body = {
          status: 'failed',
          message: `Contact with id ${contactId} was not found`
        }
      }
      await contact.destroy();

      const messages = await Message.find({
        where: {
          senderId: contactId,
          receiverId: contactId
        }
      });
      if (messages) messages.destroy();

      ctx.status = 200;
      return ctx.body = {
        status: 'success',
        message: 'Contact has been deleted together with all the messages it references'
      }

    } catch (error) {
      ctx.status = 400;
      return {
        status: 'failed',
        message: `An error occured ${error.message}`
      }
    }
  }
}

module.exports = ContactController;