import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addComment, deleteComment, toggleLikeComment } from '../../store/slices/commentsSlice';
import { addNotification } from '../../store/slices/uiSlice';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import Spinner from '../ui/Spinner';

const CommentSection = ({ postId, comments }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [replyingTo, setReplyingTo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleAddComment = async (commentData) => {
    setIsSubmitting(true);
    
    try {
      await dispatch(addComment({ postId, commentData })).unwrap();
      dispatch(
        addNotification({
          type: 'success',
          message: 'Comment added successfully',
        })
      );
    } catch (error) {
      dispatch(
        addNotification({
          type: 'danger',
          message: error.message || 'Failed to add comment',
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await dispatch(deleteComment({ postId, commentId })).unwrap();
        dispatch(
          addNotification({
            type: 'success',
            message: 'Comment deleted successfully',
          })
        );
      } catch (error) {
        dispatch(
          addNotification({
            type: 'danger',
            message: error.message || 'Failed to delete comment',
          })
        );
      }
    }
  };
  
  const handleLikeComment = async (commentId) => {
    try {
      await dispatch(toggleLikeComment({ postId, commentId })).unwrap();
    } catch (error) {
      dispatch(
        addNotification({
          type: 'danger',
          message: error.message || 'Failed to like comment',
        })
      );
    }
  };
  
  const handleReply = (commentId) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
  };
  
  return (
    <div className="comment-section">
      {user && (
        <div className="add-comment">
          <h4>Leave a Comment</h4>
          <CommentForm
            onSubmit={handleAddComment}
            isSubmitting={isSubmitting}
            placeholder="Write your comment..."
          />
        </div>
      )}
      
      <div className="comments-list">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              currentUser={user}
              onDelete={handleDeleteComment}
              onLike={handleLikeComment}
              onReply={handleReply}
              isReplying={replyingTo === comment._id}
              postId={postId}
            />
          ))
        ) : (
          <div className="no-comments">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;