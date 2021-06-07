const User = require('./schemas/user');

const findById = async (id) => {
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

const getUserByToken = async (token, body) => {
  const result = await User.findOne({ token }, { ...body });
  return result;
};

const updateAvatar = async (id, avatar) => {
  return await User.updateOne({ _id: id }, { avatar });
};

const update = async (id, body) => {
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
  updateAvatar,
  getUserByToken,
  updateToken,
};
