const router = require('express').Router();
const { getAll, getById, create, update, remove, uploadImage } = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');
const { createCategorySchema, updateCategorySchema } = require('../validators/categoryValidator');

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', protect, validate(createCategorySchema), create);
router.put('/:id', protect, validate(updateCategorySchema), update);
router.delete('/:id', protect, remove);
router.post('/:id/image', protect, upload.single('image'), uploadImage);

module.exports = router;
