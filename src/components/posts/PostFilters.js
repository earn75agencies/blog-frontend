import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts, setFilters } from '../../store/slices/postsSlice';

const PostFilters = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.posts);
  const [localFilters, setLocalFilters] = useState({
    category: '',
    author: '',
    search: '',
  });
  
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };
  
  const applyFilters = () => {
    dispatch(setFilters(localFilters));
  };
  
  const resetFilters = () => {
    const resetFilters = {
      category: '',
      author: '',
      search: '',
    };
    setLocalFilters(resetFilters);
    dispatch(setFilters(resetFilters));
  };
  
  return (
    <div className="post-filters">
      <div className="filter-group">
        <label htmlFor="category-filter">Category</label>
        <select
          id="category-filter"
          name="category"
          value={localFilters.category}
          onChange={handleChange}
        >
          <option value="">All Categories</option>
          <option value="news">News</option>
          <option value="announcement">Announcement</option>
          <option value="achievement">Achievement</option>
          <option value="event-recap">Event Recap</option>
          <option value="blog">Blog</option>
          <option value="update">Update</option>
        </select>
      </div>
      
      <div className="filter-group">
        <label htmlFor="author-filter">Author</label>
        <input
          type="text"
          id="author-filter"
          name="author"
          value={localFilters.author}
          onChange={handleChange}
          placeholder="Author name"
        />
      </div>
      
      <div className="filter-group">
        <label htmlFor="search-filter">Search</label>
        <input
          type="text"
          id="search-filter"
          name="search"
          value={localFilters.search}
          onChange={handleChange}
          placeholder="Search in title and content"
        />
      </div>
      
      <div className="filter-actions">
        <button onClick={applyFilters} className="btn btn-primary">
          Apply Filters
        </button>
        <button onClick={resetFilters} className="btn btn-secondary">
          Reset
        </button>
      </div>
    </div>
  );
};

export default PostFilters;