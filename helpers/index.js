const contactValidator = require('./contact');
const messageValidator = require('./message');

module.exports = {
  validator: {
    contactValidator,
    messageValidator
  }
};