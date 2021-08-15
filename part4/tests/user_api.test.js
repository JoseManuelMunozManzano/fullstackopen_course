const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);

describe('testing restrictions', () => {
  test('fails if the length of the password is less than 3 characters', async () => {
    const newUser = {
      username: 'aperez',
      name: 'Alexander Perez',
      password: '1',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain(
      'The length of the password must be at least 3 characters'
    );
  });

  test('fails if the length of the username is less than 3 characters', async () => {
    const newUser = {
      username: 'no',
      name: 'Bad Username',
      password: '12345',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('shorter than the minimum allowed');
  });

  test('username is required', async () => {
    const newUser = {
      name: 'Alexander Perez',
      password: '12345',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('`username` is required');
  });

  test('password is required', async () => {
    const newUser = {
      username: 'nopass',
      name: 'No password',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toBe('Password required');
  });

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const newUser = {
      username: 'aperez',
      name: 'Alexander Perez',
      password: '12345',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('`username` to be unique');
  });
});

afterAll(() => {
  mongoose.connection.close();
});
