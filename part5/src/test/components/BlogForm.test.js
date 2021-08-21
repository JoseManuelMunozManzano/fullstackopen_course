import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';

import { BlogForm } from '../../components/BlogForm';

describe('<BlogForm />', () => {
  test('calling with right details when new blog is created', () => {
    const createBlog = jest.fn();

    const component = render(<BlogForm createBlog={createBlog} />);

    const title = component.container.querySelector('#title');
    fireEvent.change(title, {
      target: { value: 'Canonical string reduction' },
    });

    const author = component.container.querySelector('#author');
    fireEvent.change(author, {
      target: {
        value: 'Edsger W. Dijkstra',
      },
    });

    const url = component.container.querySelector('#url');
    fireEvent.change(url, {
      target: {
        value:
          'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      },
    });

    const form = component.container.querySelector('form');
    fireEvent.submit(form);

    expect(createBlog.mock.calls).toHaveLength(1);

    expect(createBlog.mock.calls[0][0].title).toBe(
      'Canonical string reduction'
    );

    expect(createBlog.mock.calls[0][0].author).toBe('Edsger W. Dijkstra');
    expect(createBlog.mock.calls[0][0].url).toBe(
      'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html'
    );
  });
});
