import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from "../context/userContext";
import axios from 'axios';
import { Loader } from '../components/Loader';

export const DeletePost = ({ postID }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(''); // State for error messages
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  // Redirect to login page for any user who is not logged in
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const removePost = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setIsLoading(true);
      setError(''); // Reset error message before attempting to delete
      try {
        const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/posts/${postID}`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 200) {
          if (location.pathname === `/myposts/${currentUser.id}`) {
            navigate(0); // Refresh current page
          } else {
            navigate('/'); // Navigate to home if not in user posts
          }
        }
      } catch (error) {
        setError("Couldn't delete post. Please try again."); // Set error message
      } finally {
        setIsLoading(false); // Ensure loading is reset
      }
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {error && <p className="error-message">{error}</p>} {/* Display error message */}
      <Link className='btn sm danger' onClick={removePost}>Delete</Link>
    </>
  );
};

export default DeletePost;
