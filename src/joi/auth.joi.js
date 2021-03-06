import Joi from '@hapi/joi';

export const schemaRegister = Joi.object({
  fullname: Joi.string().min(6).max(100).required(),
  email: Joi.string().min(6).max(255).required().email(),
  pass: Joi.string().min(8).max(20).required()
});

export const schemaLogin = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  pass: Joi.string().min(8).max(20).required()
});

export const schemaEdit = Joi.object({
  fullname: Joi.string().min(6).max(100).required(),
  email: Joi.string().min(6).max(255).required().email()
});

export const schemaPass = Joi.object({
  pass: Joi.string().min(8).max(20).required()
});
