import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPosts, deletePost, publishPost, unpublishPost, archivePost } from '../../store/slices/postsSlice';
import { addNotification } from '../../store/slices/uiSlice';
import BulkActions from './BulkActions';
import Spinner from '../ui/Spinner';
import Alert from '../ui/Alert';
import formatDate from '../../utils/formatDate';
import './PostManagement.css';

const PostManagement = ({ limit = 10, statusFilter = null }) => {
  const dispatch = useDispatch();
  const { posts, status, error, pagination } = useSelector((state) => state.posts);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    const params = { page: currentPage, limit };
    if (statusFilter) {
      params.status = statusFilter;
    }
    dispatch(fetchPosts(params));
  }, [dispatch, currentPage, limit, statusFilter]);
  
  const handleSelectPost = (postId) => {
    setSelectedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };
  
  const handleSelectAll = () => {
    if (selectedPosts.length === posts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(posts.map((post) => post._id));
    }
  };
  
  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await dispatch(deletePost(postId)).unwrap();
        dispatch(
          addNotification({
            type: 'success',
            message: 'Post deleted successfully',
          })
        );
      } catch (error) {
        dispatch(
          addNotification({
            type: 'danger',
            message: error.message || 'Failed to delete post',
          })
        );
      }
    }
  };
  
  const handlePublishPost = async (postId) => {
    try {
      await dispatch(publishPost(postId)).unwrap();
      dispatch(
        addNotification({
          type: 'success',
          message: 'Post published successfully',
        })
      );
    } catch (error) {
      dispatch(
        addNotification({
          type: 'danger',
          message: error.message || 'Failed to publish post',
        })
      );
    }
  };
  
  const handleUnpublishPost = async (postId) => {
    try {
      await dispatch(unpublishPost(postId)).unwrap();
      dispatch(
        addNotification({
          type: 'success',
          message: 'Post unpublished successfully',
        })
      );
    } catch (error) {
      dispatch(
        addNotification({
          type: 'danger',
          message: error.message || 'Failed to unpublish post',
        })
      );
    }
  };
  
  const handleArchivePost = async (postId) => {
    try {
      await dispatch(archivePost(postId)).unwrap();
      dispatch(
        addNotification({
          type: 'success',
          message: 'Post archived successfully',
        })
      );
    } catch (error) {
      dispatch(
        addNotification({
          type: 'danger',
          message: error.message || 'Failed to archive post',
        })
      );
    }
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  if (status === 'loading' && posts.length === 0) {
    return <Spinner />;
  }
  
  if (status === 'failed') {
    return <Alert variant="danger">{error}</Alert>;
  }
  
  return (
    <div className="post-management">
      <div className="post-management-header">
        <h2>Post Management</h2>
        
        {selectedPosts.length > 0 && (
          <BulkActions
            selectedPosts={selectedPosts}
            onClearSelection={() => setSelectedPosts([])}
          />
        )}
      </div>
      
      {posts.length > 0 ? (
        <>
          <div className="post-table-container">
            <table className="post-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedPosts.length === posts.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Status</th>
                                    <th>Category</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedPosts.includes(post._id)}
                        onChange={() => handleSelectPost(post._id)}
                      />
                    </td>
                    <td>
                      <Link to={`/posts/${post.slug || post._id}`} className="post-title-link">
                        {post.title}
                      </Link>
                    </td>
                    <td>{post.author?.name || 'Unknown'}</td>
                    <td>
                      <span className={`status-badge ${post.status}`}>
                        {post.status}
                      </span>
                    </td>
                    <td>{post.category?.name || 'Uncategorized'}</td>
                    <td>{formatDate(post.createdAt)}</td>
                    <td>
                      <div className="post-actions">
                        <Link
                          to={`/admin/posts/edit/${post._id}`}
                          className="action-btn edit"
                          title="Edit post"
                        >
                          <i className="fas fa-edit"></i>
                        </Link>
                        
                        {post.status === 'draft' ? (
                          <button
                            onClick={() => handlePublishPost(post._id)}
                            className="action-btn publish"
                            title="Publish post"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnpublishPost(post._id)}
                            className="action-btn unpublish"
                            title="Unpublish post"
                          >
                            <i className="fas fa-eye-slash"></i>
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleArchivePost(post._id)}
                          className="action-btn archive"
                          title="Archive post"
                        >
                          <i className="fas fa-archive"></i>
                        </button>
                        
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          className="action-btn delete"
                          title="Delete post"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {pagination.pages > 1 && (
            <div className="pagination-container">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                Previous
              </button>
              
              <span className="page-info">
                Page {currentPage} of {pagination.pages}
              </span>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.pages}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="no-posts">
          <p>No posts found</p>
          <Link to="/admin/posts/new" className="btn btn-primary">
            Create New Post
          </Link>
        </div>
      )}
    </div>
  );
};

export default PostManagement;