const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  getUser,
  avatars,
  logout,
  updateSubscription,
} = require('../../../controllers/users');
const upload = require('../../../helpers/upload');
const guard = require('../../../helpers/guard');
router.post('/signup', signup);
router.post('/login', login);
router.post('/current', guard, getUser);
router.patch('/:id/subscription', guard, updateSubscription);
router.patch('/avatars', [guard, upload.single('avatar')], avatars);
router.post('/logout', guard, logout);

module.exports = router;
