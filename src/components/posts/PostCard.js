import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toggleLikePost } from '../../store/slices/postsSlice';
import { addNotification } from '../../store/slices/uiSlice';
import LikeButton from './LikeButton';
import ShareButton from './ShareButton';
import formatDate from '../../utils/formatDate';

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  
  const handleLikeToggle = async () => {
    try {
      await dispatch(toggleLikePost(post._id)).unwrap();
      dispatch(
        addNotification({
          type: 'success',
          message: post.isLiked ? 'Post unliked' : 'Post liked',
        })
      );
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
    <div className="post-card">
      {post.featuredImage && (
        <div className="post-image">
          <img src={post.featuredImage} alt={post.title} />
        </div>
      )}
      
      <div className="post-content">
        <div className="post-meta">
          {post.category && (
            <span className="post-category">{post.category.name}</span>
          )}
          <span className="post-date">{formatDate(post.publishedAt)}</span>
        </div>
        
        <h3 className="post-title">
          <Link to={`/posts/${post.slug || post._id}`}>{post.title}</Link>
        </h3>
        
        {post.excerpt && (
          <p className="post-excerpt">{post.excerpt}</p>
        )}
        
        <div className="post-author">
          {post.author && (
            <>
              <img
                src={post.author.avatar || '/images/default-avatar.png'}
                alt={post.author.name}
                className="author-avatar"
              />
              <span className="author-name">{post.author.name}</span>
            </>
          )}
        </div>
        
        <div className="post-stats">
          <span className="post-views">{post.views || 0} views</span>
          <span className="post-comments">{post.commentsCount || 0} comments</span>
        </div>
        
        <div className="post-actions">
          <LikeButton
            isLiked={post.isLiked}
            likesCount={post.likesCount || 0}
            onToggle={handleLikeToggle}
          />
          <ShareButton postId={post._id} />
        </div>
      </div>
    </div>
  );
};

export default PostCard;