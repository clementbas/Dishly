const router = require('express').Router();
const { register, verifyEmail, login, refresh, logout, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema, refreshSchema } = require('../validators/authValidator');

router.post('/register', validate(registerSchema), register);
router.get('/verify/:token', verifyEmail);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', validate(refreshSchema), refresh);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;
