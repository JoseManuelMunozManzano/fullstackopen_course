import React, { useState, useEffect } from 'react';

import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import { Notification } from './components/Notification';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [typeMessage, setTypeMessage] = useState('');

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const user = await loginService({ username, password });

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));

      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      setMessage('Wrong credentials');
      setTypeMessage('error');
      setTimeout(() => {
        setMessage(null);
        setTypeMessage('');
      }, 5000);
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();

    window.localStorage.removeItem('loggedBlogAppUser');
    blogService.unsetToken();
    setUser(null);
  };

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );

  const addBlog = async (e) => {
    e.preventDefault();

    const blogObject = {
      title,
      author,
      url,
    };

    try {
      const returnedBlog = await blogService.create(blogObject);
      setBlogs([...blogs, returnedBlog]);
      setTitle('');
      setAuthor('');
      setUrl('');

      setMessage(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
      );
      setTypeMessage('successful');
      setTimeout(() => {
        setMessage(null);
        setTypeMessage('');
      }, 5000);
    } catch (exception) {
      setMessage(
        `ERROR adding blog ${blogObject.title} by ${blogObject.author}`
      );
      setTypeMessage('error');
      setTimeout(() => {
        setMessage(null);
        setTypeMessage('');
      }, 5000);
    }
  };

  const newBlogForm = () => (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            type="text"
            value={title}
            name="Title"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={author}
            name="Author"
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={url}
            name="Url"
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );

  const blogForm = () => (
    <div>
      <h2>blogs</h2>
      <p>
        {user.name} logged-in <button onClick={handleLogout}>logout</button>
      </p>

      {newBlogForm()}

      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );

  return (
    <div>
      <Notification message={message} type={typeMessage} />
      {user === null ? loginForm() : blogForm()}
    </div>
  );
};

export default App;
