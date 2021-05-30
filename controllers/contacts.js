const Contacts = require('../model/contacts');
const { HttpCode } = require('../helpers/constants');

const getAll = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { contacts, total, limit, offset } = await Contacts.getAll(
      userId,
      req.query
    );
    return res.status(200).json({
      status: 'succes',
      code: HttpCode.SUCCESS,
      data: { total, limit, offset, contacts },
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.getContactById(userId, req.params.contactId);
    if (contact) {
      return res
        .status(200)
        .json({ status: 'succes', code: HttpCode.SUCCESS, data: { contact } });
    }
    return res.status(404).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not found',
    });
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.addContact({ ...req.body, owner: userId });
    return res
      .status(201)
      .json({ status: 'succes', code: HttpCode.CREATED, data: { contact } });
  } catch (error) {
    next(error);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.removeContact(userId, req.params.contactId);
    if (contact) {
      return res.status(200).json({
        status: 'succes',
        code: HttpCode.SUCCESS,
        data: { contact },
        message: 'Contact deleted',
      });
    }
    return res.status(404).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not found',
    });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.updateContact(
      userId,
      req.params.contactId,
      req.body
    );
    if (contact) {
      return res
        .status(200)
        .json({ status: 'succes', code: HttpCode.SUCCESS, data: { contact } });
    }
    return res.status(404).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'User found',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  addContact,
  removeContact,
  updateContact,
};
