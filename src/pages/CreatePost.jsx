import React, { useState, useContext, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { UserContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Uncategorized');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // State for success message

  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  // Redirect to login page for any user who is not logged in
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'link', 'image'
  ];

  const POST_CATEGORIES = ["Agriculture", "Business", "Education", "Entertainment", "Art", "Investment", "Uncategorized", "Weather"];

  const createPost = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message before submission
    setSuccessMessage(''); // Reset success message before submission

    if (!title || !description || !thumbnail) {
      setError('Please fill in all fields and upload an image.');
      return;
    }

    const postData = new FormData();
    postData.set('title', title);
    postData.set('category', category);
    postData.set('description', description);
    postData.set('thumbnail', thumbnail);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/posts`, postData, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 201) {
        setSuccessMessage('Post created successfully!'); // Set success message
        setTimeout(() => {
          navigate('/'); // Redirect after a brief delay
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create post. Please try again.'); // Improved error message
    }
  }

  return (
    <section className="create-post">
      <div className="container">
        <h2>Create Post</h2>
        {error && <p className='form__error-message'>{error}</p>}
        {successMessage && <p className='form__success-message'>{successMessage}</p>} {/* Success message display */}

        <form className="form create-post__form" onSubmit={createPost}>
          <input
            type="text"
            placeholder='Title'
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus
            required
          />

          <select name="category" value={category} onChange={e => setCategory(e.target.value)}>
            {POST_CATEGORIES.map(cat => <option key={cat}>{cat}</option>)}
          </select>

          <ReactQuill modules={modules} formats={formats} value={description} onChange={setDescription} />

          <input
            type="file"
            onChange={e => setThumbnail(e.target.files[0])}
            accept='image/png, image/jpg, image/jpeg'
            required
          />

          <button type="submit" className='btn-primary'>Create</button>
        </form>
      </div>
    </section>
  );
}

export default CreatePost;
