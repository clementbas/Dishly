const Joi = require('joi');

const ingredientSchema = Joi.object({
  name: Joi.string().trim().required().messages({ 'any.required': 'Ingredient name is required' }),
  quantity: Joi.string().trim().required().messages({ 'any.required': 'Ingredient quantity is required' }),
  unit: Joi.string().trim().allow('').default(''),
});

const createRecipeSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).required().messages({
    'string.min': 'Title must be at least 3 characters',
    'string.max': 'Title cannot exceed 100 characters',
    'any.required': 'Title is required',
  }),
  description: Joi.string().min(10).max(1000).required().messages({
    'string.min': 'Description must be at least 10 characters',
    'any.required': 'Description is required',
  }),
  ingredients: Joi.array().items(ingredientSchema).min(1).required().messages({
    'array.min': 'At least one ingredient is required',
    'any.required': 'Ingredients are required',
  }),
  steps: Joi.array().items(Joi.string().trim()).min(1).required().messages({
    'array.min': 'At least one step is required',
    'any.required': 'Steps are required',
  }),
  prepTime: Joi.number().integer().min(1).required().messages({
    'number.base': 'Prep time must be a number',
    'any.required': 'Prep time is required',
  }),
  cookTime: Joi.number().integer().min(0).required().messages({
    'number.base': 'Cook time must be a number',
    'any.required': 'Cook time is required',
  }),
  servings: Joi.number().integer().min(1).required().messages({
    'number.base': 'Servings must be a number',
    'any.required': 'Servings is required',
  }),
  difficulty: Joi.string().valid('easy', 'medium', 'hard').required().messages({
    'any.only': 'Difficulty must be easy, medium or hard',
    'any.required': 'Difficulty is required',
  }),
  category: Joi.string().hex().length(24).required().messages({
    'any.required': 'Category is required',
    'string.length': 'Invalid category ID',
  }),
  tags: Joi.array().items(Joi.string().trim()).default([]),
  isPublic: Joi.boolean().default(true),
});

const updateRecipeSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100),
  description: Joi.string().min(10).max(1000),
  ingredients: Joi.array().items(ingredientSchema).min(1),
  steps: Joi.array().items(Joi.string().trim()).min(1),
  prepTime: Joi.number().integer().min(1),
  cookTime: Joi.number().integer().min(0),
  servings: Joi.number().integer().min(1),
  difficulty: Joi.string().valid('easy', 'medium', 'hard'),
  category: Joi.string().hex().length(24),
  tags: Joi.array().items(Joi.string().trim()),
  isPublic: Joi.boolean(),
});

module.exports = { createRecipeSchema, updateRecipeSchema };
