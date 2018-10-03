const Joi = require('joi');

const contactSchema = Joi.object().keys({
  name: Joi.string().min(3).max(15).required(),
  phoneNumber: Joi.string().regex(/^[0-9]+$/).min(6).max(10).required()
});

module.exports = {
  contactSchema
};