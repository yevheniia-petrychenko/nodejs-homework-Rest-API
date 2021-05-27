const User = require('./schemas/user');

const findById = async (id) => {
  console.log(id);
  return await User.findOne({ _id: id });
};

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const create = async (options) => {
  const user = new User(options);
  console.log(user);
  return await user.save();
};

const update = async (id, body) => {
  //console.log(body);
  const result = await User.findOneAndUpdate(
    {
      _id: id,
    },

    { ...body },
    { new: true }
  );
  return result;
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

module.exports = {
  findById,
  findByEmail,
  create,
  update,
  updateToken,
};
