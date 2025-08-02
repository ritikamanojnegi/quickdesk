import React, { useState } from 'react';
import { ticketService } from '../../services/ticketService';

const CommentForm = ({ ticketId, onCommentAdded }) => {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const newComment = await ticketService.addComment(ticketId, {
        text: commentText
      });
      onCommentAdded(newComment);
      setCommentText('');
    } catch (err) {
      setError('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      {error && <div className="error">{error}</div>}
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Add a comment..."
        disabled={isSubmitting}
      />
      <button type="submit" disabled={isSubmitting || !commentText.trim()}>
        {isSubmitting ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  );
};

export default CommentForm;