const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post('/', (request, response) => {
  const blog = new Blog(request.body);

  if (blog.title === undefined && blog.url === undefined) {
    return response.status(400).end();
  }

  if (blog.likes === undefined) {
    blog.likes = 0;
  }

  blog.save().then((result) => {
    response.status(201).json(result);
  });
});

module.exports = blogsRouter;
