import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createPost, updatePost, resetError } from '../../store/slices/postsSlice';
import { addNotification } from '../../store/slices/uiSlice';
import Spinner from '../ui/Spinner';
import Alert from '../ui/Alert';

const PostForm = ({ postId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentPost, status, error } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    category: '',
    tags: [],
    status: 'draft',
  });
  
  const [tagInput, setTagInput] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  
  useEffect(() => {
    if (postId && currentPost) {
      setFormData({
        title: currentPost.title || '',
        content: currentPost.content || '',
        excerpt: currentPost.excerpt || '',
        featuredImage: currentPost.featuredImage || '',
        category: currentPost.category?._id || '',
        tags: currentPost.tags?.map(tag => tag._id || tag) || [],
        status: currentPost.status || 'draft',
      });
      
      if (currentPost.featuredImage) {
        setImagePreview(currentPost.featuredImage);
      }
    }
  }, [postId, currentPost]);
  
  useEffect(() => {
    return () => {
      dispatch(resetError());
    };
  }, [dispatch]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, featuredImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (postId) {
        await dispatch(updatePost({ id: postId, postData: formData })).unwrap();
        dispatch(
          addNotification({
            type: 'success',
            message: 'Post updated successfully',
          })
        );
      } else {
        await dispatch(createPost(formData)).unwrap();
        dispatch(
          addNotification({
            type: 'success',
            message: 'Post created successfully',
          })
        );
      }
      navigate('/dashboard');
    } catch (error) {
      dispatch(
        addNotification({
          type: 'danger',
          message: error.message || `Failed to ${postId ? 'update' : 'create'} post`,
        })
      );
    }
  };
  
  if (status === 'loading') {
    return <Spinner />;
  }
  
  return (
    <div className="post-form-container">
      <h2>{postId ? 'Edit Post' : 'Create New Post'}</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="excerpt">Excerpt</label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows="3"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows="15"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="featuredImage">Featured Image</label>
          <input
            type="file"
            id="featuredImage"
            onChange={handleImageChange}
            accept="image/*"
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select a category</option>
            <option value="news">News</option>
            <option value="announcement">Announcement</option>
            <option value="achievement">Achievement</option>
            <option value="event-recap">Event Recap</option>
            <option value="blog">Blog</option>
            <option value="update">Update</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <div className="tag-input-container">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag(e)}
              placeholder="Add a tag and press Enter"
            />
            <button type="button" onClick={handleAddTag}>
              Add
            </button>
          </div>
          <div className="tags-list">
            {formData.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="remove-tag"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            {user?.role === 'admin' && (
              <option value="archived">Archived</option>
            )}
          </select>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {postId ? 'Update Post' : 'Create Post'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;