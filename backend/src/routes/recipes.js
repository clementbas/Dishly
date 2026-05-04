const router = require('express').Router();
const {
  getAll, getById, create, update, remove, uploadImage, getMyRecipes,
} = require('../controllers/recipeController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');
const { createRecipeSchema, updateRecipeSchema } = require('../validators/recipeValidator');

router.get('/', getAll);
router.get('/mine', protect, getMyRecipes);
router.get('/:id', getById);
router.post('/', protect, validate(createRecipeSchema), create);
router.put('/:id', protect, validate(updateRecipeSchema), update);
router.delete('/:id', protect, remove);
router.post('/:id/image', protect, upload.single('image'), uploadImage);

module.exports = router;
