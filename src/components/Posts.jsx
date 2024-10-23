import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostItems from './PostItems';
import { Loader } from './Loader';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null); // Reset error state before fetching
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts`);
        setPosts(response?.data);
      } catch (err) {
        console.error(err); // Log error for debugging
        setError('Failed to load posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h2 className='center'>{error}</h2>; // Display error message if present
  }

  return (
    <section className="posts">
      {posts.length > 0 ? (
        <div className="container posts__container">
          {posts.map(({ _id: id, thumbnail, category, title, description, creator, createdAt }) => {
            return (
              <PostItems
                key={id}
                postID={id}
                thumbnail={thumbnail}
                category={category}
                title={title}
                description={description}
                authorID={creator} // Corrected from `creator` to `authorID`
                createdAt={createdAt}
              />
            );
          })}
        </div>
      ) : (
        <h2 className='center'>No Post Found</h2>
      )}
    </section>
  );
};

export default Posts;
