const {
  findByEmail,
  create,
  update,
  getByVerifyToken,
  updateVerifyToken,
  updateToken,
  updateAvatar,
  getUserByToken,
} = require('../model/users');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const { promisify } = require('util');
require('dotenv').config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const UploadAvatar = require('../services/avatar-cloud');
const EmailService = require('../services/email');
const {
  CreateSenderNodemailer,
  CreateSenderSG,
} = require('../services/emailSender');
const { HttpCode } = require('../helpers/constants');

cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

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
    console.log(`here should be user ${newUser}`);
    const { id, email, subscription, avatar, verifyToken } = newUser;
    //Send email
    try {
      const emailService = new EmailService(
        process.env.NODE_ENV,
        new CreateSenderSG()
      );
      await emailService.sendVerifyPasswordEmail(verifyToken, email);
    } catch (error) {
      console.log(error.message);
    }
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: { id, email, subscription, avatar },
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
    if (!user.verify) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        message: 'Check email for verification',
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

const verify = async (req, res, next) => {
  try {
    const user = await getByVerifyToken(req.params.token);
    if (user) {
      await updateVerifyToken(user.id, true, null);
      return res.status(200).json({
        status: 'succes',
        code: HttpCode.SUCCESS,
        message: 'You are verified',
      });
    }
    return res.status(404).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Your verification has failed',
    });
  } catch (error) {
    next(error);
  }
};
const repeatSendEmailVerify = async (req, res, next) => {
  const user = await findByEmail(req.body.email);
  if (user) {
    const { email, verifyToken, verify } = user;
    //Send email
    if (!verify) {
      try {
        const emailService = new EmailService(
          process.env.NODE_ENV,
          new CreateSenderNodemailer()
        );
        await emailService.sendVerifyPasswordEmail(verifyToken, email);
        return res.status(200).json({
          status: 'succes',
          code: HttpCode.SUCCESS,
          message: 'Verification email has sent',
        });
      } catch (error) {
        console.log(error.message);
        return next(error);
      }
    }
    return res.status(HttpCode.CONFLICT).json({
      status: 'error',
      code: HttpCode.CONFLICT,
      message: 'Email has already been verified',
    });
  }
  return res.status(404).json({
    status: 'error',
    code: HttpCode.NOT_FOUND,
    message: 'User is not found',
  });
};

const getUser = async (req, res, next) => {
  try {
    const user = await getUserByToken(req.params.token);
    const { email, subscription } = user;
    if (!user) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        message: 'Not authorized',
      });
    }
    return res.status(HttpCode.SUCCESS).json({
      status: 'succes',
      code: HttpCode.SUCCESS,
      data: { email, subscription },
    });
  } catch (error) {
    next(error);
  }
};

const avatars = async (req, res, next) => {
  try {
    const id = req.user.id;
    const uploadCloud = promisify(cloudinary.uploader.upload);
    const uploads = new UploadAvatar(uploadCloud);
    const { userIdImg, avatarUrl } = await uploads.saveAvatarToCloud(
      req.file.path,
      req.user.userIdImg
    );

    await updateAvatar(id, avatarUrl, userIdImg);
    return res.json({
      status: 'success',
      code: HttpCode.SUCCESS,
      data: { avatarUrl },
    });
  } catch (error) {
    next(error);
  }
};

const updateSubscription = async (req, res, next) => {
  try {
    const user = await update(req.params.id, req.body);
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

module.exports = {
  signup,
  login,
  verify,
  repeatSendEmailVerify,
  getUser,
  avatars,
  logout,
  updateSubscription,
};
