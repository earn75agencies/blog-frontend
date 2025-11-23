import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const CommentForm = ({ onSubmit, isSubmitting, placeholder = 'Write your comment...', replyTo = null }) => {
  const { user } = useSelector((state) => state.auth);
  const [content, setContent] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    const commentData = {
      content,
      ...(replyTo && { parentComment: replyTo }),
    };
    
    onSubmit(commentData);
    setContent('');
  };
  
  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <div className="comment-input-container">
        {user && (
          <img
            src={user.avatar || '/images/default-avatar.png'}
            alt={user.name}
            className="comment-avatar"
          />
        )}
        
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="comment-input"
          rows="3"
          required
        />
      </div>
      
      <div className="comment-form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting || !content.trim()}
        >
          {isSubmitting ? 'Posting...' : replyTo ? 'Reply' : 'Comment'}
        </button>
        
        {replyTo && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setContent('')}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default CommentForm;