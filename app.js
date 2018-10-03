'use strict';
require('dotenv').config();
const fs = require('fs');
const Koa = require('koa');
const app = new Koa();
const koaBody = require('koa-body');
const logger = require('koa-morgan');
const router = require('./routes/index');

const port = process.env.PORT || 5000;

app.use(koaBody());

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(__dirname + '/access.log', { flags: 'a' });

// setup the logger
app.use(logger('combined', { stream: accessLogStream }));

app.use(router.routes());



app.listen(port, console.log(`app running on port ${port}`));

