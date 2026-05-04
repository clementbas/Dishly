const Joi = require('joi');

const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 50 characters',
    'any.required': 'Category name is required',
  }),
  description: Joi.string().max(200).allow('').default('').messages({
    'string.max': 'Description cannot exceed 200 characters',
  }),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(50),
  description: Joi.string().max(200).allow(''),
});

module.exports = { createCategorySchema, updateCategorySchema };
