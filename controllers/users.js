const {
  // findById,
  findByEmail,
  create,
  update,
  updateToken,
} = require('../model/users');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const { HttpCode } = require('../helpers/constants');

const signup = async (req, res, next) => {
  try {
    const user = await findByEmail(req.body.email);

    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        message: 'Email is in use',
      });
    }
    const newUser = await create(req.body);
    console.log(`here shoul be user ${newUser}`);
    const { id, email, subscription } = newUser;
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: { id, email, subscription },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await findByEmail(email);
    const isValidPassword = await user?.validPassword(password);
    if (!user || !isValidPassword) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        message: 'Email or password is wrong',
      });
    }
    const payload = { _id: user.id };
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '2h' });
    await updateToken(user.id, token);
    return res.status(HttpCode.SUCCESS).json({
      status: 'success',
      code: HttpCode.SUCCESS,
      data: {
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateSubscription = async (req, res, next) => {
  try {
    const user = await update(req.params.id, req.body);
    console.log(req);
    if (user) {
      const { email, subscription } = user;
      return res.status(200).json({
        status: 'succes',
        code: 200,
        data: { email, subscription },
      });
    }
    return res
      .status(404)
      .json({ status: 'error', code: 404, message: 'Not found' });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  await updateToken(req.user.id, null);
  return res.status(HttpCode.NO_CONTENT).json({});
};

module.exports = { signup, login, logout, updateSubscription };
