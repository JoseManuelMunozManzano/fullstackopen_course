import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';

import { Blog } from '../../components/Blog';

let blog;
let userLogin;

describe('<Blog />', () => {
  beforeEach(() => {
    blog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com',
      likes: 10,
      user: {
        name: 'Peter Parker',
        username: 'pparker',
      },
    };

    userLogin = {
      username: 'pparker',
    };
  });

  test('renders title and author, but not url nor likes', () => {
    const component = render(<Blog blog={blog} />);

    const div = component.container.querySelector('.blog-title-jest');

    expect(div).toHaveTextContent('React patterns');
    expect(div).toHaveTextContent('Michael Chan');
    expect(div).not.toHaveTextContent('https://reactpatterns.com');
    expect(div).not.toHaveTextContent(10);
  });

  test('renders url and number of likes when the details button is clicked', () => {
    const component = render(<Blog blog={blog} userLogin={userLogin} />);
    const button = component.getByText('view');

    fireEvent.click(button);

    const div = component.container.querySelector('.blog-details-jest');

    expect(div).toHaveTextContent('https://reactpatterns.com');
    expect(div).toHaveTextContent(10);
  });

  test('clicking the button twice calls event handler twice', () => {
    const mockHandler = jest.fn();

    const component = render(
      <Blog blog={blog} userLogin={userLogin} addLike={mockHandler} />
    );

    const button = component.getByText('view');

    fireEvent.click(button);

    const buttonLike = component.container.querySelector('.button-likes-jest');

    fireEvent.click(buttonLike);
    fireEvent.click(buttonLike);

    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});
