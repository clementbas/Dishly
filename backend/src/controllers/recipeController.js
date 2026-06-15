const Recipe = require('../models/Recipe');
const fs = require('fs');
const path = require('path');

const getAll = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      difficulty,
      maxPrepTime,
      minPrepTime,
      tags,
      sort = '-createdAt',
      author,
    } = req.query;

    const filter = { isPublic: true };

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { title: regex },
        { description: regex },
        { tags: regex },
      ];
    }
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (author) filter.author = author;
    if (maxPrepTime) filter.prepTime = { ...filter.prepTime, $lte: Number(maxPrepTime) };
    if (minPrepTime) filter.prepTime = { ...filter.prepTime, $gte: Number(minPrepTime) };
    if (tags) filter.tags = { $in: tags.split(',').map((t) => t.trim()) };

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [recipes, total] = await Promise.all([
      Recipe.find(filter)
        .populate('category', 'name slug')
        .populate('author', 'username avatar')
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      Recipe.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        recipes,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
          hasNextPage: pageNum < Math.ceil(total / limitNum),
          hasPrevPage: pageNum > 1,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('category', 'name slug description')
      .populate('author', 'username avatar bio');

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    if (!recipe.isPublic && recipe.author._id.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ success: false, message: 'This recipe is private' });
    }

    res.json({ success: true, data: { recipe } });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const recipe = await Recipe.create({ ...req.body, author: req.user._id });
    await recipe.populate('category', 'name slug');
    await recipe.populate('author', 'username avatar');

    res.status(201).json({ success: true, message: 'Recipe created', data: { recipe } });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this recipe' });
    }

    const updated = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('category', 'name slug')
      .populate('author', 'username avatar');

    res.json({ success: true, message: 'Recipe updated', data: { recipe: updated } });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this recipe' });
    }

    if (recipe.image) {
      const imgPath = path.join(__dirname, '../../uploads', path.basename(recipe.image));
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await recipe.deleteOne();
    res.json({ success: true, message: 'Recipe deleted' });
  } catch (err) {
    next(err);
  }
};

const uploadImage = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    if (recipe.image) {
      const old = path.join(__dirname, '../../uploads', path.basename(recipe.image));
      if (fs.existsSync(old)) fs.unlinkSync(old);
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    recipe.image = imageUrl;
    await recipe.save();

    res.json({ success: true, message: 'Image uploaded', data: { imageUrl } });
  } catch (err) {
    next(err);
  }
};

const getMyRecipes = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [recipes, total] = await Promise.all([
      Recipe.find({ author: req.user._id })
        .populate('category', 'name slug')
        .sort('-createdAt')
        .skip(skip)
        .limit(limitNum),
      Recipe.countDocuments({ author: req.user._id }),
    ]);

    res.json({
      success: true,
      data: {
        recipes,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, remove, uploadImage, getMyRecipes };
