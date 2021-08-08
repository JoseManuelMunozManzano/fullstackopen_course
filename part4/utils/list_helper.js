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

  return _.chain(blogs)
    .groupBy('author')
    .map((value, key) => ({
      author: key,
      blogs: _.reduce(value, (sum, v) => (v.author === key ? sum + 1 : sum), 0),
    }))
    .values()
    .orderBy('blogs', 'desc')
    .head()
    .value();
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }

  return _.chain(blogs)
    .groupBy('author')
    .map((value, key) => ({
      author: key,
      likes: _.sumBy(value, (v) => v.likes),
    }))
    .values()
    .orderBy('likes', 'desc')
    .head()
    .value();
};

module.exports = {
  dummy,
  totalLikes,
  mostBlogs,
  mostLikes,
};
