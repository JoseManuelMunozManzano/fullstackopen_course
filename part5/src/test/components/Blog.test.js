import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';

import { Blog } from '../../components/Blog';

const blog = {
  title: 'React patterns',
  author: 'Michael Chan',
  url: 'https://reactpatterns.com',
  likes: 10,
};

test('renders title and author, but not url nor likes', () => {
  const component = render(<Blog blog={blog} />);

  const div = component.container.querySelector('.blog-title');

  expect(div).toHaveTextContent('React patterns');
  expect(div).toHaveTextContent('Michael Chan');
  expect(div).not.toHaveTextContent('https://reactpatterns.com');
  expect(div).not.toHaveTextContent(10);
});
