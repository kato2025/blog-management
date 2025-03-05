import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CommentList = ({ postId }) => {
  const { token } = useContext(AuthContext);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        // Include the token in the request header
        const response = await axios.get(`${API_BASE_URL}/comments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Filter only the comments that belong to the current post
        const postComments = response.data.filter(
          (comment) => comment.postId === postId
        );
        setComments(postComments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [postId, token]);

  const deleteComment = async (commentId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this comment? This action cannot be undone.'
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div className="comment-list">
      <h4>Comments</h4>
      {comments.length === 0 ? (
        <p>No comments found.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className="comment">
            <p>{comment.content}</p>
            <p>
              <strong>By:</strong> {comment.username || 'Anonymous'} |{' '}
              <strong>On:</strong>{' '}
              {comment.created_at
                ? new Date(comment.created_at).toLocaleString()
                : 'Unknown Date'}
            </p>
            <button
              onClick={() => deleteComment(comment.id)}
              className="btn btn-delete"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default CommentList;
