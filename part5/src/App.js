import React, { useState, useEffect, useRef } from 'react';

import { Blog } from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import { Notification } from './components/Notification';
import { Togglable } from './components/Togglable';
import { BlogForm } from './components/BlogForm';
import { LoginForm } from './components/LoginForm';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [typeMessage, setTypeMessage] = useState('');
  const blogFormRef = useRef();

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

  const loginForm = () => {
    return (
      <Togglable buttonLabel="log in">
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </Togglable>
    );
  };

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();

    try {
      const returnedBlog = await blogService.create(blogObject);
      setBlogs([...blogs, returnedBlog]);

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

  const addLike = async (blogObject) => {
    try {
      const blogUpdated = await blogService.put(blogObject);

      setBlogs(
        blogs.map((blog) => (blog.id === blogUpdated.id ? blogUpdated : blog))
      );
    } catch (exception) {
      setMessage(
        `ERROR adding like to the blog ${blogObject.title} by ${blogObject.author}`
      );
      setTypeMessage('error');
      setTimeout(() => {
        setMessage(null);
        setTypeMessage('');
      }, 5000);
    }
  };

  const blogForm = () => (
    <div>
      <h2>blogs</h2>
      <p>
        {user.name} logged-in <button onClick={handleLogout}>logout</button>
      </p>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} addLike={addLike} />
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
