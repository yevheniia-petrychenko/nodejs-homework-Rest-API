const { expectCt } = require('helmet');
const { login } = require('../controllers/users');
const Users = require('../model/users');
const { HttpCode } = require('../helpers/constants');

jest.mock('../model/users');

describe('Unit test users controllers', () => {
  const req = { body: { email: 'test@Worker.com', password: '1234765' } };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn((data) => data),
  };
  const next = jest.fn();

  it('Without token in Authorization header', async () => {
    Users.findByEmail = jest.fn();
    const result = await login(req, res, next);
    expect(result.status).toEqual('error');
    expect(result.code).toEqual(HttpCode.UNAUTHORIZED);
    expect(result.message).toEqual('Email or password is wrong');
  });
});
