const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./data');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');

describe('testing blog api', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});

    const blogObjects = helper.blogs.map((blog) => new Blog(blog));
    const promiseArray = blogObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);
  });

  test('all notes are returned', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body).toHaveLength(helper.blogs.length);
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
