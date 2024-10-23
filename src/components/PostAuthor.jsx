import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactTimeAgo from 'react-time-ago';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import ru from 'javascript-time-ago/locale/ru.json';

// Adding locales
TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

const PostAuthor = ({ authorID, createdAt }) => {
  const [author, setAuthor] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const getAuthor = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/${authorID}`);
        setAuthor(response?.data);
      } catch (error) {
        console.error(error);
        setError('Failed to load author details');
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
    getAuthor();
  }, [authorID]);

  const authorName = author?.name || (authorID === 1 ? "John Doe" : "Willame Banner");
  const authorAvatar = author?.avatar ? `${process.env.REACT_APP_ASSETS_URL}/uploads/${author.avatar}` : '/path/to/default/avatar.png'; // Default avatar

  if (loading) return <div>Loading author details...</div>; // Loading state
  if (error) return <div>{error}</div>; // Display error message

  return (
    <Link to={`/posts/users/${authorID}`} className='post_author'>
      <div className="post_author-avatar">
        <img src={authorAvatar} alt={authorName} />
      </div>
      <div className="post_author-details">
        <h5>By: {authorName}</h5>
        <small><ReactTimeAgo date={new Date(createdAt)} locale='en-US' /></small>
      </div>
    </Link>
  );
};

export default PostAuthor;
