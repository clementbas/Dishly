const router = require('express').Router();
const {
  getProfile, updateProfile, uploadAvatar, getFavorites, addFavorite, removeFavorite, getPublicProfile,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');
const { updateProfileSchema } = require('../validators/userValidator');

router.get('/me', protect, getProfile);
router.put('/me', protect, validate(updateProfileSchema), updateProfile);
router.post('/me/avatar', protect, upload.single('avatar'), uploadAvatar);
router.get('/me/favorites', protect, getFavorites);
router.post('/me/favorites/:recipeId', protect, addFavorite);
router.delete('/me/favorites/:recipeId', protect, removeFavorite);
router.get('/:id', getPublicProfile);

module.exports = router;
