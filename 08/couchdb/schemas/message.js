var Joi = require('joi');

var createAttributes = {
  from: Joi.string().email().required(),
  to: Joi.string().email().required(),
  subject: Joi.string().max(120).required(),
  body: Joi.string().max(1024).required(),
  createdAt: Joi.date()
};

exports.create = Joi.object().keys(createAttributes);