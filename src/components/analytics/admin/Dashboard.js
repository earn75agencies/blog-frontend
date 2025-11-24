import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPosts } from '../../store/slices/postsSlice';
import { fetchUsers } from '../../store/slices/authSlice';
import { setLoading } from '../../store/slices/uiSlice';
import PostManagement from './PostManagement';
import Spinner from '../ui/Spinner';
import './Dashboard.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { posts, status: postsStatus } = useSelector((state) => state.posts);
  const { users, status: usersStatus } = useSelector((state) => state.auth);
  
  useEffect(() => {
    dispatch(setLoading({ type: 'global', status: true }));
    dispatch(fetchPosts({ limit: 5 }));
    dispatch(fetchUsers({ limit: 5 }));
    
    return () => {
      dispatch(setLoading({ type: 'global', status: false }));
    };
  }, [dispatch]);
  
  const isLoading = postsStatus === 'loading' || usersStatus === 'loading';
  
  if (isLoading) {
    return <Spinner />;
  }
  
  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your blog content and users</p>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Posts</h3>
          <p className="stat-number">{posts.length}</p>
          <Link to="/admin/posts" className="stat-link">Manage Posts</Link>
        </div>
        
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{users.length}</p>
          <Link to="/admin/users" className="stat-link">Manage Users</Link>
        </div>
        
        <div className="stat-card">
          <h3>Published Posts</h3>
          <p className="stat-number">
            {posts.filter(post => post.status === 'published').length}
          </p>
          <Link to="/admin/posts?status=published" className="stat-link">View Published</Link>
        </div>
        
        <div className="stat-card">
          <h3>Draft Posts</h3>
          <p className="stat-number">
            {posts.filter(post => post.status === 'draft').length}
          </p>
          <Link to="/admin/posts?status=draft" className="stat-link">View Drafts</Link>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="dashboard-section">
          <h2>Recent Posts</h2>
          <PostManagement limit={5} />
        </div>
        
        <div className="dashboard-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            <Link to="/admin/posts/new" className="action-btn">
              <i className="fas fa-plus"></i>
              Create New Post
            </Link>
            
            <Link to="/admin/users" className="action-btn">
              <i className="fas fa-users"></i>
              Manage Users
            </Link>
            
            <Link to="/admin/settings" className="action-btn">
              <i className="fas fa-cog"></i>
              Settings
            </Link>
            
            <Link to="/admin/analytics" className="action-btn">
              <i className="fas fa-chart-bar"></i>
              Analytics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;