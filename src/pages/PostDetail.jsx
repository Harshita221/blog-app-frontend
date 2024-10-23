import React, { useContext, useEffect, useState } from 'react';
import PostAuthor from '../components/PostAuthor';
import { Link, useParams } from 'react-router-dom';
import { Loader } from '../components/Loader';
import DeletePost from './DeletePost';
import { UserContext } from '../context/userContext';
import axios from 'axios';

import Thumbnail from '../images/blog22.jpg';
export const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Set to true initially

  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`);
        setPost(response.data);
      } catch (error) {
        setError(error.response?.data.message || 'An error occurred while fetching the post.');
      } finally {
        setIsLoading(false); // Ensure this runs after try/catch
      }
    };

    getPost();
  }, [id]); // Added id to the dependency array

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="post-detail">
      {error && <p className='error'>{error}</p>}
      {post && (
        <div className="container post-detail_container">
          <div className="post-detail_header">
            <PostAuthor authorID={post.creator} createdAt={post.createdAt} />
            {currentUser?.id === post.creator && (
              <div className="post-detail_buttons">
                <Link to={`posts/${post._id}/edit`} className='btn sm primary'>Edit</Link>
                <DeletePost postId={id} />
              </div>
            )}
          </div>
          <h1>{post.title}</h1>
          <div className="post-detail_thumbnail">
            <img
              src={post.thumbnail ? `${process.env.REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}` : Thumbnail} // Fallback image
              alt=""
            />
          </div>
          <p dangerouslySetInnerHTML={{ __html: post.description }}></p>
        </div>
      )}
    </section>
  );
};

export default PostDetail;
