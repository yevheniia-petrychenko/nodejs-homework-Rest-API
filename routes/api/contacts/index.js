const express = require('express');
const router = express.Router();
const {
  getAll,
  getById,
  addContact,
  removeContact,
  updateContact,
} = require('../../../controllers/contacts');
const {
  validateAddContact,
  validateUpdateContact,
  validateFavoriteContact,
} = require('./validation');
const guard = require('../../../helpers/guard');

router.get('/', guard, getAll);

router.get('/:contactId', guard, getById);

router.post('/', guard, validateAddContact, addContact);

router.delete('/:contactId', guard, removeContact);

router.put('/:contactId', guard, validateUpdateContact, updateContact);

router.patch(
  '/:contactId/favorite',
  guard,
  validateFavoriteContact,
  updateContact
);

module.exports = router;
