const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');

const Blog = require('../models/blog');
const User = require('../models/user');
const { usersInDb } = require('../tests/test_helper');

blogsRouter.get('/', async (request, response, next) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post('/', async (req, res, next) => {
  const body = req.body;

  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!req.token || !decodedToken.id) {
    return next(new Error('tokenErr'));
  }

  if (body.title === undefined && body.url === undefined) {
    return next(new Error('titUrlReq'));
  }

  if (body.likes === undefined) {
    body.likes = 0;
  }

  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });

  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  res.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  const decodedToken = jwt.verify(req.token, process.env.SECRET);

  if (!req.token || !decodedToken.id) {
    return next(new Error('tokenErr'));
  }

  const user = await User.findById(decodedToken.id);
  if (blog.user.toString() !== user._id.toString()) {
    return next(new Error('UserIncorrect'));
  }

  user.blogs = user.blogs.filter(
    (b) => b._id.toString() !== req.params.id.toString()
  );
  await user.save();

  await Blog.findByIdAndRemove(req.params.id);
  res.status(204).end();
});

blogsRouter.put('/:id', async (req, res, next) => {
  const { likes } = req.body;

  const newLikes = {
    likes,
  };

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, newLikes, {
      new: true,
    });

    res.json(updatedBlog);
  } catch (error) {
    return next(error);
  }
});

module.exports = blogsRouter;
