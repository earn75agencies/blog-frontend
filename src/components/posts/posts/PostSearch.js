import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchPosts, setFilters } from '../../store/slices/postsSlice';
import { addNotification } from '../../store/slices/uiSlice';

const PostSearch = ({ placeholder = 'Search posts...' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  useEffect(() => {
    if (searchTerm.trim() && searchTerm.length > 2) {
      // In a real app, you would have a search suggestions API endpoint
      // For now, we'll just use a mock implementation
      const timer = setTimeout(() => {
        // Mock suggestions - in a real app, fetch from API
        const mockSuggestions = [
          'React best practices',
          'JavaScript tips',
          'Web development',
          'CSS tricks',
          'Node.js tutorial',
        ].filter(suggestion => 
          suggestion.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        setSuggestions(mockSuggestions);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      dispatch(setFilters({ search: searchTerm }));
      navigate('/posts');
      setShowSuggestions(false);
    }
  };
  
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    dispatch(setFilters({ search: suggestion }));
    navigate('/posts');
    setShowSuggestions(false);
  };
  
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };
  
  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => setShowSuggestions(false), 200);
  };
  
  const handleInputFocus = () => {
    if (searchTerm.trim()) {
      setShowSuggestions(true);
    }
  };
  
  return (
    <div className="post-search">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus}
            placeholder={placeholder}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </div>
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="search-suggestions">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default PostSearch;