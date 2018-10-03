'use strict';

const Router = require('koa-router');
const router = new Router({
  prefix: '/contacts'
});
const ContactController = require('../controllers/contact');

router.post('/', ContactController.createContact);

module.exports = router;