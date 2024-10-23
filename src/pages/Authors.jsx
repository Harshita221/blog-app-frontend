import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // assuming you're using react-router for navigation
import { Loader } from '../components/Loader';
import axios from 'axios';

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // Added error state

  useEffect(() => {
    const getAuthors = async () => {
      setIsLoading(true);
      setError(null); // Reset error state before fetching
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users`); 
        setAuthors(response.data || []); // Fallback to empty array if no data
      } catch (error) {
        console.log(error);
        setError('Failed to load authors.'); // Set error message
      } finally {
        setIsLoading(false); // Ensure loading state is reset
      }
    };
    
    getAuthors();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h2 className='center'>{error}</h2>; // Display error message if present
  }

  return (
    <section className="authors">
      {authors.length > 0 ? (
        <div className="container authors__container">
          {authors.map(({ _id: id, avatar, name, posts }) => (
            <div key={id} className="author">
              <Link to={`/posts/users/${id}`} className='author'> {/* Fixed className typo */}
                <div className="author__avatar">
                  <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${avatar}`} alt={`Image of ${name}`} />
                </div>
                <div className="author__info">
                  <h4 className='author_name'>{name}</h4>
                  <p>{posts} posts</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <h2 className='center'>No User/Authors Found.</h2>
      )}
    </section>
  );
};

export default Authors;
