'use strict';

const Joi = require('joi');
const Message = require('../models').Message;
const Validator = require('../helpers/index').validator;

class MessageController {
  static async createMessage(ctx) {
    const {error, value} = Joi.validate(ctx.request.body, Validator.messageValidator.messageSchema);
    if (error) {
      ctx.status = 400;
      return ctx.body = {
        status: 'failed',
        message: `Message validation failed ${error.message}`
      }
    }
    try {
      const {text, receiverId} = value;
      const senderId = ctx.params.contactId;
      const message = await Message.create({
        text,
        receiverId,
        senderId,
        status: true
      });
      ctx.status = 201;
      return ctx.body = {
        status: 'Success',
        data: message,
        message: 'Message sent successfully'
      }
    } catch (err) {
      ctx.status = 400;
      switch (err.name) {
        case 'SequelizeForeignKeyConstraintError':
          return ctx.body = {
            status: 'failed',
            message: `Failed to save the message ${err.message}`
          };
        default:
          return ctx.body = {
            status: 'failed',
            message: `Saving message failed ${err.message}`
          }
      }
    }
  }
}

module.exports = MessageController;