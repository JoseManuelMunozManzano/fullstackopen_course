import { useState } from 'react';

export const Blog = ({ blog }) => {
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

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={handleDetails}>{showDetails ? 'hide' : 'view'}</button>
        {showDetails && (
          <div>
            <div>{blog.url}</div>
            <div>
              likes {blog.likes} <button>like</button>
            </div>
            <div>{blog.user.name}</div>
          </div>
        )}
      </div>
    </div>
  );
};
