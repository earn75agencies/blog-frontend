import React from 'react';
import { useDispatch } from 'react-redux';
import { toggleLikePost } from '../../store/slices/postsSlice';
import { addNotification } from '../../store/slices/uiSlice';

const LikeButton = ({ postId, isLiked, likesCount, onToggle }) => {
  const dispatch = useDispatch();
  
  const handleToggle = async () => {
    try {
      if (onToggle) {
        onToggle();
      } else {
        await dispatch(toggleLikePost(postId)).unwrap();
        dispatch(
          addNotification({
            type: 'success',
            message: isLiked ? 'Post unliked' : 'Post liked',
          })
        );
      }
    } catch (error) {
      dispatch(
        addNotification({
          type: 'danger',
          message: error.message || 'Failed to toggle like',
        })
      );
    }
  };
  
  return (
    <button
      onClick={handleToggle}
      className={`like-button ${isLiked ? 'liked' : ''}`}
      aria-label={isLiked ? 'Unlike post' : 'Like post'}
    >
      <i className={`fas fa-heart ${isLiked ? 'fas' : 'far'}`}></i>
      <span className="likes-count">{likesCount || 0}</span>
    </button>
  );
};

export default LikeButton;