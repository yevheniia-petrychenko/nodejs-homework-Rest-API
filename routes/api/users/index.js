const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  logout,
  updateSubscription,
} = require('../../../controllers/users');
const guard = require('../../../helpers/guard');
router.post('/signup', signup);
router.post('/login', login);
router.patch('/:id/subscription', guard, updateSubscription);
router.post('/logout', guard, logout);

module.exports = router;
