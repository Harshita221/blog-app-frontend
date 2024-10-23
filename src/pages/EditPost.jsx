import React, { useState, useContext, useEffect } from 'react';
import ReactQuill from 'react-quill';
import { UserContext } from '../context/userContext';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const EditPost = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Uncategorized');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state
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

  // Modules and formats for ReactQuill
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'link', 'image',
  ];

  const POST_CATEGORIES = [
    'Agriculture', 'Business', 'Education', 'Entertainment',
    'Art', 'Investment', 'Uncategorized', 'Weather',
  ];

  // Fetch the existing post details
  useEffect(() => {
    const getPost = async () => {
      setIsLoading(true); // Start loading
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`);
        setTitle(response.data.title);
        setDescription(response.data.description);
        setCategory(response.data.category); // Set category if available
      } catch (error) {
        setError("Couldn't fetch post data. Please try again."); // Error handling
      } finally {
        setIsLoading(false); // End loading
      }
    };
    
    getPost();
  }, [id]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    const validImageTypes = ['image/png', 'image/jpg', 'image/jpeg'];

    if (file && validImageTypes.includes(file.type)) {
      setThumbnail(file);
    } else {
      alert('Please upload a valid image (PNG, JPG, JPEG)');
    }
  };

  const editPost = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      setError('Please fill in all required fields.');
      return;
    }

    const postData = new FormData();
    postData.set('title', title);
    postData.set('category', category);
    postData.set('description', description);
    if (thumbnail) {
      postData.set('thumbnail', thumbnail); // Only append thumbnail if it exists
    }

    setIsLoading(true); // Start loading
    try {
      const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/posts/${id}`, postData, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 200) {
        navigate('/'); // Navigate to home on success
      }
    } catch (error) {
      setError(error.response?.data?.message || "Couldn't update post. Please try again."); // More robust error handling
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <section className="create-post">
      <div className="container">
        <h2>Edit Post</h2>
        {error && <p className="form__error-message">{error}</p>}
        {isLoading ? <p>Loading...</p> : (
          <form className="form create-post__form" onSubmit={editPost}>
            <input 
              type="text" 
              placeholder='Title' 
              value={title}
              onChange={e => setTitle(e.target.value)} 
              autoFocus
            />
            <select 
              name="category" 
              value={category} 
              onChange={e => setCategory(e.target.value)}>
              <option value="" disabled>Select Category</option>
              {POST_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ReactQuill 
              modules={modules} 
              formats={formats} 
              value={description} 
              onChange={setDescription} 
            />
            <input 
              type="file" 
              onChange={handleThumbnailChange} 
              accept=".png, .jpg, .jpeg" 
            />
            <button type="submit" className='btn-primary'>Edit</button>
          </form>
        )}
      </div>
    </section>
  );
};

export default EditPost;
