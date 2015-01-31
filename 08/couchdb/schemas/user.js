var extend = require('util')._extend;
var Joi = require('joi');

var updateAttributes = {
  _id: Joi.string(),
  _rev: Joi.string(),
  password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/),
  access_token: [Joi.string(), Joi.number()],
  birthyear: Joi.number().integer().min(1900).max((new Date()).getFullYear())
};

exports.update = Joi.object().keys(updateAttributes);

var createAttributes = extend({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email()
}, updateAttributes);

exports.create = Joi.object().keys(createAttributes);