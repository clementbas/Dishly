const Joi = require('joi');

const updateProfileSchema = Joi.object({
  username: Joi.string().trim().min(3).max(30).messages({
    'string.min': 'Username must be at least 3 characters',
    'string.max': 'Username cannot exceed 30 characters',
  }),
  bio: Joi.string().max(250).allow('').messages({
    'string.max': 'Bio cannot exceed 250 characters',
  }),
});

module.exports = { updateProfileSchema };
