import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';

export const Logout = () => {
  const { setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the current user and any tokens if necessary
    setCurrentUser(null);
    localStorage.removeItem('token'); // Clear token from localStorage (if you're using it)

    // Redirect to the login page or home page
    navigate('/login'); // or navigate('/') to go to home page
  }, [setCurrentUser, navigate]); // Dependencies array

  return null; // No UI to render
};

export default Logout;
