import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import CommentList from './CommentList';
import PostForm from './PostForm'; // Import PostForm
import AuthContext from '../context/AuthContext';
import "../App.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const PostList = ({ onPostUpdated, onPostDeleted }) => {
  const { token, user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [expandedPosts, setExpandedPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [editValues, setEditValues] = useState({ title: '', content: '' });
  const [isFormVisible, setIsFormVisible] = useState(false); // New state for form visibility

  // Fetch posts on mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/posts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(response.data.filter(post => post.authorId === user.id));
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, [token, user]);

  // Handle new post creation
  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]); // Add new post to the top
    setIsFormVisible(false); // Hide form after creation
  };

  // Toggle published/unpublished status
  const togglePublishStatus = async (postId, published) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/posts/${postId}`,
        { published: !published },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      if (onPostUpdated) onPostUpdated(postId, response.data);
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === postId ? response.data : post))
      );
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post status.');
    }
  };

  // Toggle comments
  const toggleComments = (postId) => {
    setExpandedPosts((prevExpanded) =>
      prevExpanded.includes(postId)
        ? prevExpanded.filter((id) => id !== postId)
        : [...prevExpanded, postId]
    );
  };

  // Edit functions remain unchanged
  const handleEditClick = (post) => {
    setEditingPost(post.id);
    setEditValues({ title: post.title, content: post.content });
  };

  const cancelEdit = () => {
    setEditingPost(null);
    setEditValues({ title: '', content: '' });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e, postId) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${API_BASE_URL}/posts/${postId}`,
        { title: editValues.title, content: editValues.content },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      if (onPostUpdated) onPostUpdated(postId, response.data);
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === postId ? response.data : post))
      );
      setEditingPost(null);
      setEditValues({ title: '', content: '' });
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post.');
    }
  };

  // Delete function remains unchanged
  const handleDelete = async (postId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const post = response.data;

      if (post.comments && post.comments.length > 0) {
        alert('You cannot delete this post because it has related comments.');
        return;
      } else if (window.confirm('Are you sure you want to delete this post?')) {
        await axios.delete(`${API_BASE_URL}/posts/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (onPostDeleted) onPostDeleted(postId);
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post.');
    }
  };

  return (
    <div className='container'>
      {/* Create Post Button */}
      {!isFormVisible && (
        <button
          onClick={() => setIsFormVisible(true)}
          className="btn-createpost"
          style={{ marginBottom: '15px' }}
        >
          Create Post
        </button>
      )}

      {/* Conditionally Render PostForm */}
      {isFormVisible && (
        <PostForm
          onPostCreated={handlePostCreated}
          onCancel={() => setIsFormVisible(false)} // Pass cancel handler
        />
      )}
      <h2 className='postheading'>All Posts</h2>
      {/* Posts List */}
      {posts.length === 0 ? (
      <p>No posts found.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="post-card">
            {editingPost === post.id ? (
              <form onSubmit={(e) => handleEditSubmit(e, post.id)} className="post-edit-form">
                <div>
                  <label>Title:</label>
                  <input
                    type="text"
                    name="title"
                    value={editValues.title}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div>
                  <label>Content:</label>
                  <textarea
                    name="content"
                    value={editValues.content.replace(/<\/?[^>]+(>|$)/g, "")}
                    onChange={handleEditChange}
                    rows="5"
                    required
                  />
                </div>
                <button type="submit" className="btn">Save</button>
                <button type="button" className="btn" onClick={cancelEdit}>Cancel</button>
              </form>
            ) : (
              <>
                <h3>{post.title}</h3>
                <p className="post-date">
                  <strong>Date Posted:</strong> {new Date(post.createdAt).toLocaleString()}
                </p>
                <div
                  className="post-content"
                  dangerouslySetInnerHTML={{ __html: post.content.replace(/<\/?p>/g, '') }}
                />
                <p className="post-meta">
                  <strong>Author:</strong> {post.authorId} | <strong>Status:</strong>{' '}
                  <span
                    style={{
                      color: post.published ? 'var(--success-color)' : 'var(--danger-color)',
                      fontWeight: 'bold',
                    }}
                  >
                    {post.published ? 'Published' : 'Unpublished'}
                  </span>
                </p>
                <button
                  onClick={() => togglePublishStatus(post.id, post.published)}
                  className={post.published ? 'btn btn-unpublish' : 'btn btn-publish'}
                >
                  {post.published ? 'Unpublish' : 'Publish'}
                </button>
                <button onClick={() => handleEditClick(post)} className="btn btn-edit">
                  Edit
                </button>
                <button onClick={() => handleDelete(post.id)} className="btn btn-delete">
                  Delete
                </button>
                <div className="comment-toggle-container">
                  <span className="comment-count">
                    Comments {post.comments ? post.comments.length : 0}
                  </span>
                  {post.comments && post.comments.length > 0 && (
                    <button
                      onClick={() => toggleComments(post.id)}
                      className="comment-toggle-btn"
                    >
                      {expandedPosts.includes(post.id) ? 'Hide' : 'Show'}
                    </button>
                  )}
                </div>
                {expandedPosts.includes(post.id) && post.comments && (
                  <div className="comment-list">
                    <CommentList postId={post.id} />
                  </div>
                )}
              </>
            )}
          </div>
        ))
      )}
           <footer>
        <p style={{ marginBottom: "-10px", fontSize: "1.1rem", textAlign: "center" }}>
          <strong>Developed by:</strong> Dr. Kato Samuel Namuene
        </p>
        <p style={{fontSize: "1.1rem", textAlign: "center" }}>
          <strong>Email:</strong> kato.namuene@ubuea.cm
        </p>
      </footer>
    </div>
  );
};

export default PostList;