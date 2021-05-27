// const fs = require('fs/promises')
const Contact = require('./schemas/contact');

const getAll = async (userId, query) => {
  const {
    limit = 5,
    offset = 0,
    sortBy,
    sortByDesc,
    filter,
    favorite = null,
  } = query;
  const optionSearch = { owner: userId };
  if (favorite !== null) {
    optionSearch.favorite = favorite;
  }
  const results = await Contact.paginate(optionSearch, {
    limit,
    offset,
    filter: filter ? filter.split('|').join(' ') : '',
    sort: {
      ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
      ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
    },
  });
  const { docs: contacts, totalDocs: total } = results;
  // .populate({
  //   path: 'owner',
  //   select: 'email subscription -_id',
  // });
  return { contacts, total, limit, offset };
};

const getContactById = async (userId, contactId) => {
  const result = await Contact.findOne({
    _id: contactId,
    owner: userId,
  }).populate({ path: 'owner', select: 'email subscription -_id' });

  return result;
};

const removeContact = async (userId, contactId) => {
  const result = await Contact.findByIdAndDelete({
    _id: contactId,
    owner: userId,
  });
  return result;
};

const addContact = async (body) => {
  const result = await Contact.create(body);
  return result;
};

const updateContact = async (userId, contactId, body) => {
  const result = await Contact.findOneAndUpdate(
    {
      _id: contactId,
      owner: userId,
    },
    { ...body },
    { new: true }
  );
  return result;
};

const updateStatusContact = async (userId, contactId, body) => {
  const result = await Contact.findOneAndUpdate(
    {
      _id: contactId,
      owner: userId,
    },
    { ...body },
    { new: true }
  );
  return result;
};

module.exports = {
  getAll,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
