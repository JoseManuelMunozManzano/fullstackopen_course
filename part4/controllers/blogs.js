const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body);

  if (blog.title === undefined && blog.url === undefined) {
    return response.status(400).end();
  }

  if (blog.likes === undefined) {
    blog.likes = 0;
  }

  const result = await blog.save();
  response.status(201).json(result);
});

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

blogsRouter.put('/:id', async (request, response, next) => {
  const { likes } = request.body;

  const newLikes = {
    likes,
  };

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      newLikes,
      {
        new: true,
      }
    );

    response.json(updatedBlog);
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
