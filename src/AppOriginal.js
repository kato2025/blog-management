import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostList from './components/PostList';
import PostForm from './components/PostForm';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/posts`);
        setPosts(response.data);
        setError(null);
      } catch (error) {
        setError(`Failed to fetch posts: ${error.response?.data?.message || error.message}`);
        console.error('Full error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Prepend the new post so it shows immediately at the top.
  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  // Update a post’s published status or other fields.
  const handlePostUpdated = (postId, updatedData) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, ...updatedData } : post
      )
    );
  };

  // Remove the post from the UI after deletion.
  const handlePostDeleted = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  return (
    <div className="App">
      <h1>Blog Management</h1>
      <PostForm onPostCreated={handlePostCreated} />
      
      {loading ? (
        <p>Loading posts...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <PostList
          posts={posts}
          onPostUpdated={handlePostUpdated}
          onPostDeleted={handlePostDeleted}
        />
      )}
    </div>
  );
}

export default App;
