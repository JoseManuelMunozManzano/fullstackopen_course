import { useState } from 'react';

export const Blog = ({ blog, addLike }) => {
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
      user: blog.user,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
      id: blog.id,
    });
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={handleDetails}>{showDetails ? 'hide' : 'view'}</button>
        {showDetails && (
          <div>
            <div>{blog.url}</div>
            <div>
              likes {blog.likes} <button onClick={handleLike}>like</button>
            </div>
            <div>{blog.user.name}</div>
          </div>
        )}
      </div>
    </div>
  );
};
