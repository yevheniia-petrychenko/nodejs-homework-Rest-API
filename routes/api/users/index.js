const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  getUser,
  logout,
  updateSubscription,
} = require('../../../controllers/users');
const guard = require('../../../helpers/guard');
router.post('/signup', signup);
router.post('/login', login);
router.post('/current', guard, getUser);
router.patch('/:id/subscription', guard, updateSubscription);
router.post('/logout', guard, logout);

module.exports = router;
