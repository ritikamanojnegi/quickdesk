import React, { useState, useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext.jsx';
import { ticketService } from '../../Services/ticketservice.js';
import LoadingSpinner from '../UI/Loadingspinner.jsx';

const CommentSection = ({ ticketId, comments, onCommentAdded }) => {
  const { user } = useContext(AuthContext);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    setError('');
    try {
      const commentData = {
        userId: user.id,
        content: newComment.trim()
      };
      const addedComment = await ticketService.addComment(ticketId, commentData);
      onCommentAdded(addedComment);
      setNewComment('');
    } catch (err) {
      setError('Failed to add comment. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="comments-section">
      <h2>Comments</h2>
      
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <div className="comments-list">
          {comments.map(comment => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <span className="comment-author">
                  {comment.userId === user.id ? 'You' : `User #${comment.userId}`}
                </span>
                <span className="comment-date">{formatDate(comment.createdAt)}</span>
              </div>
              <div className="comment-content">{comment.content}</div>
            </div>
          ))}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="comment-form">
        <h3>Add a Comment</h3>
        {error && <div className="error-message">{error}</div>}
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Type your comment here..."
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? <LoadingSpinner small /> : 'Add Comment'}
        </button>
      </form>
    </div>
  );
};

export default CommentSection;