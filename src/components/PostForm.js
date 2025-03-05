import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Editor } from '@tinymce/tinymce-react';
import AuthContext from '../context/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const TINYMCE_API_KEY = process.env.REACT_APP_TINYMCE_API_KEY;

const PostForm = ({ onPostCreated, onCancel }) => { // Added onCancel prop
  const { token, user } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token || !user) {
      alert("❌ You are not authenticated. Please log in.");
      return;
    }

    if (!title.trim() || !content.trim()) {
      alert("❌ Title and content cannot be empty.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/posts`,
        { title, content, authorId: user.id, published: false },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );

      console.log("✅ Post created:", response.data);
      alert("✅ Post created successfully!");

      setTitle('');
      setContent('');

      if (onPostCreated) onPostCreated(response.data);
      window.dispatchEvent(new CustomEvent("newPostCreated", { detail: response.data }));
    } catch (error) {
      console.error('Failed to create post:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      alert(`❌ Failed to create post: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='newpost'>
      <h3>Create a New Post</h3>
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Content:</label>
        <Editor
          apiKey={TINYMCE_API_KEY}
          value={content}
          onEditorChange={(newContent) => setContent(newContent)}
          init={{
            height: 300,
            menubar: false,
            plugins: 'link image code',
            toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | code',
          }}
        />
      </div>
      <button className='postformbutton' type="submit">Create Post</button>
      <button className='postformbutton' type="button" onClick={onCancel} style={{ marginLeft: '10px' }}>
        Cancel
      </button>
    </form>
  );
};

export default PostForm;