import React from 'react';
import { useSelector } from 'react-redux';
import CommentForm from './CommentForm';
import formatDate from '../../utils/formatDate';

const CommentItem = ({
  comment,
  currentUser,
  onDelete,
  onLike,
  onReply,
  isReplying = false,
  postId,
}) => {
  const { user } = useSelector((state) => state.auth);
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete(comment._id);
    }
  };
  
  const handleLike = () => {
    if (onLike) {
      onLike(comment._id);
    }
  };
  
  const handleReply = () => {
    if (onReply) {
      onReply(comment._id);
    }
  };
  
  const isAuthor = currentUser && comment.author && currentUser._id === comment.author._id;
  const isAdmin = currentUser && currentUser.role === 'admin';
  
  return (
    <div className="comment-item">
      <div className="comment-header">
        <img
          src={comment.author?.avatar || '/images/default-avatar.png'}
          alt={comment.author?.name}
          className="comment-avatar"
        />
        
        <div className="comment-meta">
          <span className="comment-author">{comment.author?.name}</span>
          <span className="comment-date">{formatDate(comment.createdAt)}</span>
        </div>
        
        <div className="comment-actions">
          <button
            onClick={handleLike}
            className={`comment-like ${comment.isLiked ? 'liked' : ''}`}
            aria-label={comment.isLiked ? 'Unlike comment' : 'Like comment'}
          >
            <i className={`fas fa-heart ${comment.isLiked ? 'fas' : 'far'}`}></i>
            <span>{comment.likesCount || 0}</span>
          </button>
          
          {user && (
            <button
              onClick={handleReply}
              className="comment-reply"
              aria-label="Reply to comment"
            >
              <i className="fas fa-reply"></i>
              Reply
            </button>
          )}
          
          {(isAuthor || isAdmin) && (
            <button
              onClick={handleDelete}
              className="comment-delete"
              aria-label="Delete comment"
            >
              <i className="fas fa-trash"></i>
            </button>
          )}
        </div>
      </div>
      
      <div className="comment-content">
        <p>{comment.content}</p>
      </div>
      
      {isReplying && (
        <div className="comment-reply-form">
          <CommentForm
            onSubmit={(data) => {
              // Handle reply submission
              onReply && onReply(comment._id);
            }}
            placeholder={`Reply to ${comment.author?.name}...`}
            replyTo={comment._id}
          />
        </div>
      )}
      
      {/* Nested comments would be rendered here if your API supports them */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="comment-replies">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              currentUser={currentUser}
              onDelete={onDelete}
              onLike={onLike}
              onReply={onReply}
              postId={postId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;