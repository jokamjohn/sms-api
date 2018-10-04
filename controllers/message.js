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
      ctx.status = 500;
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

  static async listReceivedMessages(ctx) {
    const contactId = ctx.params.contactId;
    if (!contactId) {
      ctx.status = 400;
      return ctx.body = {
        status: 'failed',
        message: 'Provide a contact Id'
      }
    }

    try {
      const messages = await Message.findAll({
        where: {
          receiverId: contactId
        }
      });
      ctx.status = 200;
      return ctx.body = {
        status: 'success',
        data: messages,
        message: `Successfully returned messages received by a contact with Id ${contactId}`
      }
    } catch (error) {
      ctx.status = 500;
      return ctx.body = {
        status: 'failed',
        message: `Failed to retrieve messages ${error.message}`
      }
    }
  }

  static async listSentMessages(ctx) {
    const contactId = ctx.params.contactId;
    if (!contactId) {
      ctx.status = 400;
      return ctx.body = {
        status: 'failed',
        message: 'Provide a contact Id'
      }
    }

    try {
      const messages = await Message.findAll({
        where: {
          senderId: contactId
        }
      });
      ctx.status = 200;
      return ctx.body = {
        status: 'success',
        data: messages,
        message: `Successfully returned messages sent by a contact with Id ${contactId}`
      }
    } catch (error) {
      ctx.status = 500;
      return ctx.body = {
        status: 'failed',
        message: `Failed to retrieve messages ${error.message}`
      }
    }
  }

  static async deleteMessage(ctx) {
    const contactId = ctx.params.contactId;
    const messageId = ctx.params.messageId;

    if (!contactId && messageId) {
      ctx.status = 400;
      return ctx.body = {
        status: 'failed',
        message: 'Contact Id or message Id is missing'
      }
    }

    try {
      const message = await Message.find({
        where: {
          id: messageId,
          senderId: contactId
        }
      });
      if (!message) {
        ctx.status = 404;
        return ctx.body = {
          status: 'failed',
          message: 'Could not find the message'
        }
      }
      await message.destroy();
      ctx.status = 200;
      return ctx.body = {
        status: 'success',
        message: 'Message deleted successfully'
      }
    } catch (error) {
      ctx.status = 500;
      return ctx.body = {
        status: 'failed',
        message: `An error occurred while deleting the message ${error.message}`
      }
    }
  }
}

module.exports = MessageController;