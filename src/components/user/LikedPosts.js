import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLikedPosts } from '../../store/slices/postsSlice';
import { setLoading } from '../../store/slices/uiSlice';
import PostCard from '../posts/PostCard';
import PostPagination from '../posts/PostPagination';
import Spinner from '../ui/Spinner';
import Alert from '../ui/Alert';

const LikedPosts = () => {
  const dispatch = useDispatch();
  const { likedPosts, status, error, pagination } = useSelector((state) => state.posts);
  
  useEffect(() => {
    dispatch(setLoading({ type: 'posts', status: true }));
    dispatch(fetchLikedPosts({ page: pagination.page }));
    
    return () => {
      dispatch(setLoading({ type: 'posts', status: false }));
    };
  }, [dispatch, pagination.page]);
  
  const handlePageChange = (page) => {
    dispatch(fetchLikedPosts({ page }));
  };
  
  if (status === 'loading' && likedPosts.length === 0) {
    return <Spinner />;
  }
  
  if (status === 'failed') {
    return <Alert variant="danger">{error}</Alert>;
  }
  
  return (
    <div className="liked-posts">
      <div className="liked-posts-header">
        <h1>Liked Posts</h1>
        <p>Posts you've liked and saved for later</p>
      </div>
      
      {likedPosts.length > 0 ? (
        <>
          <div className="posts-grid">
            {likedPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
          
          {pagination.pages > 1 && (
            <PostPagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className="no-liked-posts">
          <div className="no-content-icon">
            <i className="far fa-heart"></i>
          </div>
          <h3>No liked posts yet</h3>
          <p>Start liking posts to see them here</p>
          <a href="/posts" className="btn btn-primary">
            Browse Posts
          </a>
        </div>
      )}
    </div>
  );
};

export default LikedPosts;