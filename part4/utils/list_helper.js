const _ = require('lodash');

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes;
  };

  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0);
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }

  const { author } = _.maxBy(blogs, (blog) => blog.author);
  const numberBlogs = _.reduce(
    blogs,
    (sum, blog) => {
      return blog.author === author ? sum + 1 : sum;
    },
    0
  );

  return { author, blogs: numberBlogs };
};

module.exports = {
  dummy,
  totalLikes,
  mostBlogs,
};
