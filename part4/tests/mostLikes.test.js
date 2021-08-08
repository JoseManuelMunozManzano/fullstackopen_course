const mostLikes = require('../utils/list_helper').mostLikes;
const blogs = require('./data').blogs;

describe('most likes', () => {
  test('of empty list is {}', () => {
    const result = mostLikes([]);

    expect(result).toEqual({});
  });

  test('obtain author who has the largest amount of likes and the number of them', () => {
    const result = mostLikes(blogs);

    expect(result).toEqual({ author: 'Edsger W. Dijkstra', likes: 17 });
  });
});
