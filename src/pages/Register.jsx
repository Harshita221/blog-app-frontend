import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Make sure to import axios

export const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const changeInputHandler = (e) => {
    setUserData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const registerUser = async (e) => {
    e.preventDefault();
    setError(''); // Reset error before submission

    // Check if passwords match
    if (userData.password !== userData.password2) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true); // Set loading state to true

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/register`, userData); // Use environment variable for API URL
      if (response.data) {
        // Optionally, you can handle success here (like navigating to a login page)
        navigate('/login'); // Redirect to login on successful registration
      }
    } catch (err) {
      setError(err.response?.data.message || 'An error occurred.'); // Use optional chaining to handle possible undefined response
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <section className='register'>
      <div className='container'>
        <h2>Sign Up</h2>
        <form className="form register__form" onSubmit={registerUser}>
          {error && <p className="form__error-message">{error}</p>}
          <input
            type="text"
            placeholder='Full Name'
            name='name'
            value={userData.name}
            onChange={changeInputHandler}
          />
          <input
            type="text"
            placeholder='Email'
            name='email'
            value={userData.email}
            onChange={changeInputHandler}
          />
          <input
            type="password"
            placeholder='Password'
            name='password'
            value={userData.password}
            onChange={changeInputHandler}
          />
          <input
            type="password"
            placeholder='Confirm Password'
            name='password2'
            value={userData.password2}
            onChange={changeInputHandler}
          />
          <button type="submit" className='btn primary' disabled={loading}> // Disable button while loading
            {loading ? 'Registering...' : 'Register'} // Show loading text
          </button>
        </form>
        <small>Already have an account? <Link to="/login">Sign In</Link></small>
      </div>
    </section>
  );
};

export default Register;
