const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  verify,
  repeatSendEmailVerify,
  getUser,
  avatars,
  logout,
  updateSubscription,
} = require('../../../controllers/users');
router.get('/verify/:token', verify);
router.post('/verify', repeatSendEmailVerify);
const upload = require('../../../helpers/upload');
const guard = require('../../../helpers/guard');
router.post('/signup', signup);
router.post('/login', login);
router.post('/current', guard, getUser);
router.patch('/:id/subscription', guard, updateSubscription);
router.patch('/avatars', [guard, upload.single('avatar')], avatars);
router.post('/logout', guard, logout);

module.exports = router;
