'use strict';

const constants = require('../helpers/constants');
const Router = require('koa-router');
const router = new Router({
  prefix: `${constants.API_V1_BASE_URL}/contacts`
});
const ContactController = require('../controllers/contact');
const MessageController = require('../controllers/message');

router.post('/', ContactController.createContact);

router.post('/:contactId/sms', MessageController.createMessage);

module.exports = router;