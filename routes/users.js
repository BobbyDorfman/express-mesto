const router = require('express').Router();
const {
  getUsers,
  getCurrentUser,
  getUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');
const { avatarValidation, userDataValidation, userIdValidation } = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:id', userIdValidation, getUser);
router.patch('/me', userDataValidation, updateUser);
router.patch('/me/avatar', avatarValidation, updateAvatar);

module.exports = router;
