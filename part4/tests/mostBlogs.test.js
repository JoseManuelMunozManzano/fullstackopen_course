const mostBlogs = require('../utils/list_helper').mostBlogs;
const blogs = require('./test_helper').blogs;

describe('most blogs', () => {
  test('obtain author who has the largest amount of blogs and the number of them', () => {
    const result = mostBlogs(blogs);

    expect(result).toEqual({ author: 'Robert C. Martin', blogs: 3 });
  });

  test('of empty list is {}', () => {
    const result = mostBlogs([]);

    expect(result).toEqual({});
  });
});
