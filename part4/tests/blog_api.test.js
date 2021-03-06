const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const bcrypt = require('bcrypt');
const app = require('../app');
const api = supertest(app);

const Blog = require('../models/blog');
const User = require('../models/user');

beforeEach(async () => {
  await User.deleteMany({});
  const userObjects = helper.users.map((user) => new User(user));
  const promiseArrayUsers = userObjects.map((user) => user.save());

  await Blog.deleteMany({});
  const blogObjects = helper.blogs.map((blog) => new Blog(blog));
  const promiseArrayBlogs = blogObjects.map((blog) => blog.save());

  await Promise.all(promiseArrayUsers, promiseArrayBlogs);

  // await Blog.deleteMany({});

  // const blogObjects = helper.blogs.map((blog) => new Blog(blog));
  // const promiseArray = blogObjects.map((blog) => blog.save());
  // await Promise.all(promiseArray);

  // await User.deleteMany({});
  // const passwordHash = await bcrypt.hash('sekret', 10);
  // const user = new User({ username: 'testUser', passwordHash });
  // await user.save();
});

describe('when there is initially some blogs saved', () => {
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body).toHaveLength(helper.blogs.length);
  });

  test('the unique identifier property is named id', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body[0].id).toBeDefined();
  });
});

describe('additon of a new blog', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: "Josh W. Comeau's Blog",
      author: 'Josh W. Comeau',
      url: 'https://www.joshwcomeau.com/',
      likes: 9,
    };

    const user = await api.get('/api/users');
    const token = helper.obtainToken(user.body[0]);

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', 'bearer ' + token)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.blogs.length + 1);

    const titles = blogsAtEnd.map((b) => b.title);
    expect(titles).toContain("Josh W. Comeau's Blog");
  });

  test('error if no token added', async () => {
    const newBlog = {
      title: "Josh W. Comeau's Blog",
      author: 'Josh W. Comeau',
      url: 'https://www.joshwcomeau.com/',
      likes: 9,
    };

    const result = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('invalid token');

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.blogs.length);
  });
});

describe('existence of blog properties', () => {
  test('if not exists likes property, then likes will be 0', async () => {
    const newBlog = {
      title: "Josh W. Comeau's Blog",
      author: 'Josh W. Comeau',
      url: 'https://www.joshwcomeau.com/',
    };

    const user = await api.get('/api/users');
    const token = helper.obtainToken(user.body[0]);

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', 'bearer ' + token)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const { likes } = blogsAtEnd.filter((b) => b.title === newBlog.title)[0];

    expect(likes).toBe(0);
  });

  test('no title and url properties then status 400', async () => {
    const newBlog = {
      author: 'Josh W. Comeau',
      likes: 10,
    };

    const user = await api.get('/api/users');
    const token = helper.obtainToken(user.body[0]);

    const result = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', 'bearer ' + token)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('Title and Url required');
  });
});

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    const user = await api.get('/api/users');
    const token = helper.obtainToken(user.body[0]);

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', 'bearer ' + token)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.blogs.length - 1);

    const titles = blogsAtEnd.map((b) => b.title);
    expect(titles).not.toContain(blogToDelete.title);
  });
});

describe('updating blog', () => {
  test('succeeds with status 200 if blog updated', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const updatedBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200);

    expect(updatedBlog.body.likes).toBe(blogToUpdate.likes + 1);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
