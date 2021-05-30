const Subscription = {
  STARTER: 'starter',
  PRO: 'pro',
  BUSINESS: 'business',
};

const HttpCode = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 505,
};

module.exports = { Subscription, HttpCode };
