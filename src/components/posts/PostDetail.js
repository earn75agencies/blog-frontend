import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPost, clearCurrentPost } from '../../store/slices/postsSlice';
import { fetchComments } from '../../store/slices/commentsSlice';
import { setLoading } from '../../store/slices/uiSlice';
import LikeButton from './LikeButton';
import ShareButton from './ShareButton';
import CommentSection from './CommentSection';
import Spinner from '../ui/Spinner';
import Alert from '../ui/Alert';
import formatDate from '../../utils/formatDate';

const PostDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentPost, status, error } = useSelector((state) => state.posts);
  const { commentsByPost } = useSelector((state) => state.comments);
  
  useEffect(() => {
    dispatch(setLoading({ type: 'posts', status: true }));
    dispatch(fetchPost(id));
    
    return () => {
      dispatch(clearCurrentPost());
    };
  }, [dispatch, id]);
  
  useEffect(() => {
    if (status !== 'loading') {
      dispatch(setLoading({ type: 'posts', status: false }));
    }
  }, [status, dispatch]);
  
  useEffect(() => {
    if (currentPost) {
      dispatch(fetchComments({ postId: currentPost._id }));
    }
  }, [currentPost, dispatch]);
  
  if (status === 'loading') {
    return <Spinner />;
  }
  
  if (status === 'failed' || !currentPost) {
    return <Alert variant="danger">{error || 'Post not found'}</Alert>;
  }
  
  const postComments = commentsByPost[currentPost._id]?.comments || [];
  
  return (
    <div className="post-detail">
      <article className="post-article">
        <header className="post-header">
          <h1 className="post-title">{currentPost.title}</h1>
          
          <div className="post-meta">
            {currentPost.category && (
              <span className="post-category">{currentPost.category.name}</span>
            )}
            <span className="post-date">{formatDate(currentPost.publishedAt)}</span>
          </div>
          
          <div className="post-author">
            {currentPost.author && (
              <>
                <img
                  src={currentPost.author.avatar || '/images/default-avatar.png'}
                  alt={currentPost.author.name}
                  className="author-avatar"
                />
                <div className="author-info">
                  <span className="author-name">{currentPost.author.name}</span>
                  {currentPost.author.bio && (
                    <p className="author-bio">{currentPost.author.bio}</p>
                  )}
                </div>
              </>
            )}
          </div>
        </header>
        
        {currentPost.featuredImage && (
          <div className="post-image">
            <img src={currentPost.featuredImage} alt={currentPost.title} />
          </div>
        )}
        
        <div className="post-content">
          <div dangerouslySetInnerHTML={{ __html: currentPost.content }} />
        </div>
        
        <footer className="post-footer">
          <div className="post-stats">
            <span className="post-views">{currentPost.views || 0} views</span>
            <span className="post-comments">{currentPost.commentsCount || 0} comments</span>
          </div>
          
          <div className="post-actions">
            <LikeButton
              isLiked={currentPost.isLiked}
              likesCount={currentPost.likesCount || 0}
              postId={currentPost._id}
            />
            <ShareButton postId={currentPost._id} />
          </div>
        </footer>
      </article>
      
      <div className="post-comments-section">
        <h3>Comments ({postComments.length})</h3>
        <CommentSection postId={currentPost._id} comments={postComments} />
      </div>
    </div>
  );
};

export default PostDetail;