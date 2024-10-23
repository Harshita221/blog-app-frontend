import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { UserContext } from "../context/userContext";
import axios from 'axios';
import Loader from '../components/Loader';
import DeletePost from './DeletePost';

export const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(''); // State for error messages
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;
  const { id } = useParams();

  // Redirect to login page for any user who is not logged in
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(''); // Reset error message before fetching
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/users/${id}`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        });
        setPosts(response.data);
      } catch (error) {
        setError('Failed to fetch posts. Please try again.'); // Set error message
      } finally {
        setIsLoading(false); // Set loading to false in finally to ensure it runs regardless of success or error
      }
    };

    fetchPosts();
  }, [id, token]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="dashboard">
      {error && <p className="error-message">{error}</p>} {/* Error message display */}
      {posts.length ? (
        <div className="container dashboard__container">
          {posts.map((post) => (
            <article key={post._id} className="dashboard__post">
              <div className="dashboard__post-info">
                <div className="dashboard__post-thumbnail">
                  <img 
                    src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}`} 
                    alt={post.title || "Post Thumbnail"} // Accessibility improvement
                  />
                </div>
                <h5 className='dashboard_post_title'>{post.title}</h5>
              </div>
              <div className="dashboard__post-actions">
                <Link to={`/posts/${post._id}`} className="btn sm">View</Link>
                <Link to={`/posts/${post._id}/edit`} className="btn sm primary">Edit</Link>
                <DeletePost postID={post._id} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <h2 className="center">You have no posts yet.</h2>
      )}
    </section>
  );
};

export default Dashboard;
