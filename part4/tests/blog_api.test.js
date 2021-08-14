const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
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

  test('the unique identifier property is named id', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body[0].id).toBeDefined();
  });

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: "Josh W. Comeau's Blog",
      author: 'Josh W. Comeau',
      url: 'https://www.joshwcomeau.com/',
      likes: 9,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.blogs.length + 1);

    const titles = blogsAtEnd.map((b) => b.title);
    expect(titles).toContain("Josh W. Comeau's Blog");
  });

  test('if not exists likes property, then likes will be 0', async () => {
    const newBlog = {
      title: "Josh W. Comeau's Blog",
      author: 'Josh W. Comeau',
      url: 'https://www.joshwcomeau.com/',
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const { likes } = blogsAtEnd.filter((b) => b.title === newBlog.title)[0];

    expect(likes).toBe(0);
  });

  test('no title and url then status 400', async () => {
    const newBlog = {
      author: 'Josh W. Comeau',
      likes: 10,
    };

    await api.post('/api/blogs').send(newBlog).expect(400);
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
