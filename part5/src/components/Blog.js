import React, { useState } from 'react';

export const Blog = ({ blog, addLike, removeBlog, userLogin }) => {
  const [showDetails, setShowDetails] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleLike = () => {
    addLike({
      user: blog.user.id,
      likes: blog.likes,
      author: blog.author,
      title: blog.title,
      url: blog.url,
      id: blog.id,
    });
  };

  const handleRemove = () => {
    removeBlog(blog);
  };

  return (
    <div style={blogStyle}>
      <div className="blog-title-jest">
        {blog.title} {blog.author}{' '}
        <button onClick={handleDetails}>{showDetails ? 'hide' : 'view'}</button>
        {showDetails && (
          <div className="blog-details-jest">
            <div>{blog.url}</div>
            <div>
              likes {blog.likes}{' '}
              <button className="button-likes-jest" onClick={handleLike}>
                like
              </button>
            </div>
            <div>{blog.user.name}</div>

            {userLogin.username === blog.user.username && (
              <button id="remove-button" onClick={handleRemove}>
                remove
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
