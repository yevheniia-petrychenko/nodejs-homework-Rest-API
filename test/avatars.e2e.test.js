const request = require('supertest');
const fs = require('fs/promises');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const app = require('../app');
const db = require('../model/db');
const { newUser } = require('./data/dataUser');
const User = require('../model/schemas/user');
const { HttpCode } = require('../helpers/constants');
const Users = require('../model/users');

describe('e2e test for route api/users', () => {
  let token;
  beforeAll(async () => {
    await db;
    await User.deleteOne({ email: newUser.email });
  });
  afterAll(async () => {
    const mongo = await db;
    await User.deleteOne({ email: newUser.email });
    await mongo.disconnect();
  });
  beforeEach(async () => {});
  it('should responce code 201 for signup', async () => {
    const res = await request(app).post('/api/users/signup').send(newUser);

    expect(res.status).toEqual(HttpCode.CREATED);
    expect(res.body).toBeDefined();
  });
  it('should responce code 409 for signup', async () => {
    const res = await request(app).post('/api/users/signup').send(newUser);

    expect(res.status).toEqual(HttpCode.CONFLICT);
    expect(res.body).toBeDefined();
  });
  it('should responce code 401 for login', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'jess@gb.com', password: '000000' });

    expect(res.status).toEqual(HttpCode.UNAUTHORIZED);
    expect(res.body).toBeDefined();
  });
  it('should responce code 200 for login', async () => {
    const res = await request(app).post('/api/users/login').send(newUser);

    expect(res.status).toEqual(HttpCode.SUCCESS);
    expect(res.body).toBeDefined();
    token = res.body.data.token;
  });
  it('should responce code 401 for patch avatar with invalid token', async () => {
    const img = await fs.readFile('./test/data/new-w-ava.png');
    const res = await request(app)
      .patch('/api/users/avatars')
      .set('Authorization', `Bearer 123`)
      .attach('avatar', img, 'new-w-ava.png');

    expect(res.status).toEqual(HttpCode.UNAUTHORIZED);
    expect(res.body).toBeDefined();
  });
  it('should response status code 200 for patch avatar', async () => {
    const img = await fs.readFile('./test/data/new-w-ava.png');

    const res = await request(app)
      .patch('/api/users/avatars')
      .set('Authorization', `Bearer ${token}`)
      .attach('avatar', img, 'new-w-ava.png');

    expect(res.status).toEqual(HttpCode.SUCCESS);
    expect(res.body).toBeDefined();
    expect(res.body.data.avatarUrl).toBeDefined();
  });
});
