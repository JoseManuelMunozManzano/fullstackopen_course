const totalLikes = require('../utils/list_helper').totalLikes;
const listWithOneBlog = require('./test_helper').listWithOneBlog;
const blogs = require('./test_helper').blogs;

describe('total likes', () => {
  test('of empty list is zero', () => {
    expect(totalLikes([])).toBe(0);
  });

  test('when list has only one blog, equals the likes of that', () => {
    const result = totalLikes(listWithOneBlog);

    expect(result).toBe(5);
  });

  test('of a bigger list is calculated right', () => {
    const result = totalLikes(blogs);

    expect(result).toBe(36);
  });
});
