const express = require('express');
const router = express.Router();
const Contacts = require('../../model/contacts');
const {
  validateAddContact,
  validateUpdateContact,
  validateFavoriteContact,
} = require('./validation');

router.get('/', async (req, res, next) => {
  try {
    const contacts = await Contacts.getAll();
    return res
      .status(200)
      .json({ status: 'succes', code: 200, data: { contacts } });
  } catch (error) {
    next(error);
  }
});

router.get('/:contactId', async (req, res, next) => {
  try {
    const contact = await Contacts.getContactById(req.params.contactId);
    if (contact) {
      return res
        .status(200)
        .json({ status: 'succes', code: 200, data: { contact } });
    }
    return res
      .status(404)
      .json({ status: 'error', code: 404, message: 'Not found' });
  } catch (error) {
    next(error);
  }
});

router.post('/', validateAddContact, async (req, res, next) => {
  try {
    const contact = await Contacts.addContact(req.body);
    return res
      .status(201)
      .json({ status: 'succes', code: 201, data: { contact } });
  } catch (error) {
    next(error);
  }
});

router.delete('/:contactId', async (req, res, next) => {
  try {
    const contact = await Contacts.removeContact(req.params.contactId);
    if (contact) {
      return res.status(200).json({
        status: 'succes',
        code: 200,
        data: { contact },
        message: 'Contact deleted',
      });
    }
    return res
      .status(404)
      .json({ status: 'error', code: 404, message: 'Not found' });
  } catch (error) {
    next(error);
  }
});

router.put('/:contactId', validateUpdateContact, async (req, res, next) => {
  try {
    const contact = await Contacts.updateContact(
      req.params.contactId,
      req.body
    );
    if (contact) {
      return res
        .status(200)
        .json({ status: 'succes', code: 200, data: { contact } });
    }
    return res
      .status(404)
      .json({ status: 'error', code: 404, message: 'Not found' });
  } catch (error) {
    next(error);
  }
});

router.patch(
  '/:contactId/favorite',
  validateFavoriteContact,
  async (req, res, next) => {
    try {
      const contact = await Contacts.updateStatusContact(
        req.params.contactId,
        req.body
      );
      if (contact) {
        return res
          .status(200)
          .json({ status: 'succes', code: 200, data: { contact } });
      }
      return res
        .status(404)
        .json({ status: 'error', code: 404, message: 'Not found' });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
