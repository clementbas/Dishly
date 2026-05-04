const User = require('../models/User');
const Recipe = require('../models/Recipe');
const fs = require('fs');
const path = require('path');

const getProfile = async (req, res) => {
  res.json({ success: true, data: { user: req.user } });
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json({ success: true, message: 'Profile updated', data: { user } });
  } catch (err) {
    next(err);
  }
};

const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    if (req.user.avatar) {
      const old = path.join(__dirname, '../../uploads', path.basename(req.user.avatar));
      if (fs.existsSync(old)) fs.unlinkSync(old);
    }

    const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user._id, { avatar: avatarUrl }, { new: true });

    res.json({ success: true, message: 'Avatar updated', data: { avatarUrl, user } });
  } catch (err) {
    next(err);
  }
};

const getFavorites = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));

    const user = await User.findById(req.user._id).populate({
      path: 'favorites',
      populate: [
        { path: 'category', select: 'name slug' },
        { path: 'author', select: 'username avatar' },
      ],
      options: {
        skip: (pageNum - 1) * limitNum,
        limit: limitNum,
      },
    });

    const total = req.user.favorites.length;

    res.json({
      success: true,
      data: {
        recipes: user.favorites,
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

const addFavorite = async (req, res, next) => {
  try {
    const { recipeId } = req.params;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    if (req.user.favorites.includes(recipeId)) {
      return res.status(409).json({ success: false, message: 'Recipe already in favorites' });
    }

    await User.findByIdAndUpdate(req.user._id, { $addToSet: { favorites: recipeId } });
    res.json({ success: true, message: 'Recipe added to favorites' });
  } catch (err) {
    next(err);
  }
};

const removeFavorite = async (req, res, next) => {
  try {
    const { recipeId } = req.params;

    await User.findByIdAndUpdate(req.user._id, { $pull: { favorites: recipeId } });
    res.json({ success: true, message: 'Recipe removed from favorites' });
  } catch (err) {
    next(err);
  }
};

const getPublicProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('username avatar bio createdAt');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const recipeCount = await Recipe.countDocuments({ author: user._id, isPublic: true });
    res.json({ success: true, data: { user, recipeCount } });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateProfile, uploadAvatar, getFavorites, addFavorite, removeFavorite, getPublicProfile };
