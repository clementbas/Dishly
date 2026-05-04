const Category = require('../models/Category');
const Recipe = require('../models/Recipe');
const fs = require('fs');
const path = require('path');

const getAll = async (req, res, next) => {
  try {
    const categories = await Category.find().populate('createdBy', 'username').sort('name');
    res.json({ success: true, data: { categories } });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id).populate('createdBy', 'username');

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const recipeCount = await Recipe.countDocuments({ category: category._id, isPublic: true });

    res.json({ success: true, data: { category, recipeCount } });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const category = await Category.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, message: 'Category created', data: { category } });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ success: true, message: 'Category updated', data: { category } });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const recipeCount = await Recipe.countDocuments({ category: category._id });
    if (recipeCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category with ${recipeCount} associated recipe(s)`,
      });
    }

    if (category.image) {
      const imgPath = path.join(__dirname, '../../uploads', path.basename(category.image));
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await category.deleteOne();
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
};

const uploadImage = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    if (category.image) {
      const old = path.join(__dirname, '../../uploads', path.basename(category.image));
      if (fs.existsSync(old)) fs.unlinkSync(old);
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    category.image = imageUrl;
    await category.save();

    res.json({ success: true, message: 'Image uploaded', data: { imageUrl } });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, remove, uploadImage };
