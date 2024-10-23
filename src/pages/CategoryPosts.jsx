import React, { useState, useEffect } from 'react';
import PostItems from '../components/PostItems';
import { Loader } from '../components/Loader';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CategoryPosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { category } = useParams();

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/categories/${category}`);
        setPosts(data || []); // Fallback to empty array if no data is returned
      } catch (err) {
        console.log(err);
        setError('Failed to load posts. Please try again later.'); // More descriptive error message
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [category]);

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
          {posts.map(({ _id: id, thumbnail, category, title, description, creator, createdAt }) => (
            <PostItems
              key={id}
              postID={id}
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
        <h2 className='center'>No Posts Found in this Category</h2> // Enhanced message
      )}
    </section>
  );
}

export default CategoryPosts;
