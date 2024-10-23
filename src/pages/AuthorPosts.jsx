import React, { useState, useEffect } from 'react';
import PostItems from '../components/PostItems';
import { Loader } from '../components/Loader';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export const AuthorPosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    let isMounted = true; // Track whether the component is mounted

    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/users/${id}`);
        
        if (isMounted) { // Only update state if still mounted
          setPosts(response?.data || []); // Fallback to empty array if no data
        }
      } catch (err) {
        console.log(err);
        if (isMounted) {
          setError(err.response?.data?.message || 'Failed to load posts'); // More detailed error message
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPosts();

    return () => {
      isMounted = false; // Cleanup function to avoid state updates on unmounted component
    };
  }, [id]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h2 className='center'>{error}</h2>;
  }

  return (
    <section className="posts">
      {posts.length > 0 ? (
        <div className="container posts__container">
          {posts.map(({ _id: postId, thumbnail, category, title, description, creator, createdAt }) => (
            <PostItems
              key={postId}
              postID={postId}
              thumbnail={thumbnail}
              category={category}
              title={title}
              description={description}
              authorID={creator}
              createdAt={createdAt}
            />
          ))}
        </div>
      ) : (
        <h2 className='center'>No Post Found</h2>
      )}
    </section>
  );
};

export default AuthorPosts;
