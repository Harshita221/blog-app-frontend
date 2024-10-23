import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/userContext.js';

export const Login = () => {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(UserContext);

  const changeInputHandler = (e) => {
    setUserData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const loginUser = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true); // Set loading state

    // Basic validation
    if (!userData.email || !userData.password) {
      setError('Please fill in all fields.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/login`, userData);
      const user = response.data;
      setCurrentUser(user); // Set the current user in context
      // Optionally save user token for persistent sessions
      localStorage.setItem('token', user.token);
      navigate('/'); // Redirect to home page after successful login
    } catch (err) {
      setError(err.response?.data.message || 'An error occurred.'); // Handle error
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <section className='register'>
      <div className='container'>
        <h2>Sign In</h2>
        <form className="form login__form" onSubmit={loginUser}>
          {error && <p className="form__error-message">{error}</p>}
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            name='email'
            placeholder='Email'
            value={userData.email}
            onChange={changeInputHandler}
            autoFocus
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name='password'
            placeholder='Password'
            value={userData.password}
            onChange={changeInputHandler}
          />
          <button type="submit" className='btn primary' disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Login'}
          </button>
        </form>
        <small>Don't have an account? <Link to="/register">Sign Up</Link></small>
      </div>
    </section>
  );
};

export default Login;
