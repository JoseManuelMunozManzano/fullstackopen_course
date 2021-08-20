const blogsRouter = require('express').Router();
const middleware = require('../utils/middleware');

const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response, next) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post('/', middleware.userExtractor, async (req, res, next) => {
  const body = req.body;

  if (body.title === undefined && body.url === undefined) {
    return next(new Error('titUrlReq'));
  }

  if (body.likes === undefined) {
    body.likes = 0;
  }

  const user = req.user;

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

blogsRouter.delete('/:id', middleware.userExtractor, async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  const user = req.user;
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
  const blog = req.body;

  blog.likes += 1;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {
      new: true,
    }).populate('user', { username: 1, name: 1 });

    res.json(updatedBlog);
  } catch (error) {
    return next(error);
  }
});

module.exports = blogsRouter;
