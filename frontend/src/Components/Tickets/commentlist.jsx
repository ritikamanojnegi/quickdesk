import React from 'react';

const CommentList = ({ comments }) => {
  return (
    <div className="comment-list">
      <h3>Comments ({comments.length})</h3>
      {comments.length > 0 ? (
        <ul>
          {comments.map(comment => (
            <li key={comment.id} className="comment-item">
              <div className="comment-header">
                <strong>{comment.user.name}</strong>
                <span>{new Date(comment.createdAt).toLocaleString()}</span>
              </div>
              <p className="comment-text">{comment.text}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments yet</p>
      )}
    </div>
  );
};

export default CommentList;