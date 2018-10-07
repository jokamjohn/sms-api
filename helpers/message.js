'use strict';

const Joi = require('joi');

const messageSchema = Joi.object().keys({
  text: Joi.string().min(1).max(160).required(),
  receiverId: Joi.number().required()
});

module.exports = {
  messageSchema
};