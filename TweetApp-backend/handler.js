'use strict';
const app =require('./app');
const serverless = require('serverless-http');
console.info("inside handler")
module.exports.main = serverless(app)