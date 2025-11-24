import React, { useState, useEffect } from 'react';
import { communityService, Community, CommunityPost, CommunityMember, CommunityComment } from '../../services/community.service';
import './CommunityManager.css';

interface CommunityManagerProps {
  userId: string;
}

const CommunityManager: React.FC<CommunityManagerProps> = ({ userId }) => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'browse' | 'my-communities' | 'community' | 'create'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const response = await communityService.getAllCommunities();
      setCommunities(response.communities);
    } catch (error) {
      console.error('Error loading communities:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCommunityDetails = async (community: Community) => {
    try {
      setSelectedCommunity(community);
      const [postsResponse, membersResponse] = await Promise.all([
        communityService.getCommunityPosts(community.id),
        communityService.getCommunityMembers(community.id),
      ]);
      
      setPosts(postsResponse.posts);
      setMembers(membersResponse.members);
    } catch (error) {
      console.error('Error loading community details:', error);
    }
  };

  const handleJoinCommunity = async (communityId: string) => {
    try {
      await communityService.joinCommunity(communityId);
      
      // Refresh communities to update join status
      const response = await communityService.getAllCommunities();
      setCommunities(response.communities);
    } catch (error) {
      console.error('Error joining community:', error);
    }
  };

  const handleLeaveCommunity = async (communityId: string) => {
    try {
      await communityService.leaveCommunity(communityId);
      
      // Refresh communities to update join status
      const response = await communityService.getAllCommunities();
      setCommunities(response.communities);
      
      if (selectedCommunity?.id === communityId) {
        setSelectedCommunity(null);
        setPosts([]);
        setMembers([]);
      }
    } catch (error) {
      console.error('Error leaving community:', error);
    }
  };

  const handleCreateCommunity = async (data: any) => {
    try {
      const newCommunity = await communityService.createCommunity(data);
      setCommunities([...communities, newCommunity]);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating community:', error);
    }
  };

  const handleCreatePost = async (data: any) => {
    if (!selectedCommunity) return;
    
    try {
      const newPost = await communityService.createCommunityPost(selectedCommunity.id, data);
      setPosts([newPost, ...posts]);
      setShowPostForm(false);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      await communityService.likePost(postId);
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likeCount: post.likeCount + 1, isLiked: true }
          : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleUnlikePost = async (postId: string) => {
    try {
      await communityService.unlikePost(postId);
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likeCount: post.likeCount - 1, isLiked: false }
          : post
      ));
    } catch (error) {
      console.error('Error unliking post:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadInitialData();
      return;
    }

    try {
      const response = await communityService.searchCommunities(searchQuery, {
        category: selectedCategory,
        type: selectedType,
      });
      setCommunities(response.communities);
    } catch (error) {
      console.error('Error searching communities:', error);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isJoined = (communityId: string): boolean => {
    return communities.some(c => c.id === communityId && c.isJoined);
  };

  if (loading) {
    return <div className="community-manager-loading">Loading communities...</div>;
  }

  return (
    <div className="community-manager">
      <div className="manager-header">
        <h1>Community Hub</h1>
        <div className="manager-tabs">
          <button
            className={`tab-button ${activeTab === 'browse' ? 'active' : ''}`}
            onClick={() => setActiveTab('browse')}
          >
            Browse
          </button>
          <button
            className={`tab-button ${activeTab === 'my-communities' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-communities')}
          >
            My Communities
          </button>
          {selectedCommunity && (
            <button
              className={`tab-button ${activeTab === 'community' ? 'active' : ''}`}
              onClick={() => setActiveTab('community')}
            >
              {selectedCommunity.name}
            </button>
          )}
          <button
            className={`tab-button ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            Create
          </button>
        </div>
      </div>

      {activeTab === 'browse' && (
        <div className="browse-tab">
          <div className="search-controls">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search communities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button onClick={handleSearch}>Search</button>
            </div>
            
            <div className="filters">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-filter"
              >
                <option value="">All Categories</option>
                <option value="technology">Technology</option>
                <option value="business">Business</option>
                <option value="education">Education</option>
                <option value="gaming">Gaming</option>
                <option value="arts">Arts & Culture</option>
                <option value="health">Health & Wellness</option>
                <option value="sports">Sports</option>
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="type-filter"
              >
                <option value="">All Types</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="restricted">Restricted</option>
              </select>
            </div>
          </div>

          <div className="communities-grid">
            {communities.map((community) => (
              <div key={community.id} className="community-card">
                <div className="community-header">
                  <img src={community.avatar} alt={community.name} className="community-avatar" />
                  <div className="community-info">
                    <h3>{community.name}</h3>
                    <p className="community-category">{community.category}</p>
                  </div>
                  <div className="community-type">{community.type}</div>
                </div>
                <div className="community-cover">
                  <img src={community.coverImage} alt={community.name} />
                </div>
                <div className="community-details">
                  <p className="community-description">{community.shortDescription}</p>
                  <div className="community-stats">
                    <span className="members">{community.memberCount} members</span>
                    <span className="posts">{community.postCount} posts</span>
                  </div>
                  <div className="community-tags">
                    {community.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                  <div className="community-actions">
                    <button
                      className="view-btn"
                      onClick={() => loadCommunityDetails(community)}
                    >
                      View Community
                    </button>
                    {!isJoined(community.id) ? (
                      <button
                        className="join-btn"
                        onClick={() => handleJoinCommunity(community.id)}
                      >
                        Join
                      </button>
                    ) : (
                      <button
                        className="leave-btn"
                        onClick={() => handleLeaveCommunity(community.id)}
                      >
                        Leave
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'my-communities' && (
        <div className="my-communities-tab">
          <h2>My Communities</h2>
          <div className="my-communities-grid">
            {communities
              .filter(community => community.isJoined)
              .map((community) => (
                <div key={community.id} className="my-community-card">
                  <div className="community-header">
                    <img src={community.avatar} alt={community.name} className="community-avatar" />
                    <div className="community-info">
                      <h3>{community.name}</h3>
                      <p className="community-category">{community.category}</p>
                    </div>
                    <div className="user-role">
                      {community.isAdmin ? 'Admin' : community.isModerator ? 'Moderator' : 'Member'}
                    </div>
                  </div>
                  <div className="community-cover">
                    <img src={community.coverImage} alt={community.name} />
                  </div>
                  <div className="community-details">
                    <p className="community-description">{community.shortDescription}</p>
                    <div className="community-stats">
                      <span className="members">{community.memberCount} members</span>
                      <span className="posts">{community.postCount} posts</span>
                    </div>
                    <div className="community-actions">
                      <button
                        className="manage-btn"
                        onClick={() => {
                          loadCommunityDetails(community);
                          setActiveTab('community');
                        }}
                      >
                        Open Community
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {activeTab === 'community' && selectedCommunity && (
        <div className="community-tab">
          <div className="community-header-section">
            <div className="community-hero">
              <img src={selectedCommunity.coverImage} alt={selectedCommunity.name} className="hero-image" />
              <div className="hero-overlay">
                <div className="hero-content">
                  <img src={selectedCommunity.avatar} alt={selectedCommunity.name} className="hero-avatar" />
                  <h2>{selectedCommunity.name}</h2>
                  <p>{selectedCommunity.description}</p>
                  <div className="hero-stats">
                    <span>{selectedCommunity.memberCount} members</span>
                    <span>{selectedCommunity.postCount} posts</span>
                    <span>{selectedCommunity.type}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="community-actions-bar">
              <button
                className="create-post-btn"
                onClick={() => setShowPostForm(true)}
              >
                + Create Post
              </button>
              <div className="action-buttons">
                <button className="members-btn">Members ({members.length})</button>
                <button className="settings-btn">Settings</button>
                <button
                  className="leave-btn"
                  onClick={() => handleLeaveCommunity(selectedCommunity.id)}
                >
                  Leave Community
                </button>
              </div>
            </div>
          </div>

          <div className="community-content">
            <div className="posts-section">
              <h3>Community Posts</h3>
              <div className="posts-list">
                {posts.map((post) => (
                  <div key={post.id} className="post-card">
                    <div className="post-header">
                      <img src={post.author.avatar || '/default-avatar.png'} alt={post.author.username} className="author-avatar" />
                      <div className="author-info">
                        <h4>{post.author.username}</h4>
                        <span className="post-date">{formatDate(post.createdAt)}</span>
                      </div>
                      <div className="post-type">{post.type}</div>
                    </div>
                    
                    {post.title && (
                      <h3 className="post-title">{post.title}</h3>
                    )}
                    
                    <div className="post-content">
                      <p>{post.content}</p>
                    </div>
                    
                    {post.attachments && post.attachments.length > 0 && (
                      <div className="post-attachments">
                        {post.attachments.map((attachment) => (
                          <div key={attachment.id} className="attachment">
                            {attachment.type === 'image' ? (
                              <img src={attachment.url} alt={attachment.fileName} />
                            ) : (
                              <div className="file-attachment">
                                <span className="file-icon">📄</span>
                                <span className="file-name">{attachment.fileName}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="post-stats">
                      <button
                        className={`like-btn ${post.isLiked ? 'liked' : ''}`}
                        onClick={() => post.isLiked ? handleUnlikePost(post.id) : handleLikePost(post.id)}
                      >
                        {post.isLiked ? '❤️' : '🤍'} {post.likeCount}
                      </button>
                      <button className="comment-btn">💬 {post.commentCount}</button>
                      <button className="share-btn">🔗 {post.shareCount}</button>
                      <button className="bookmark-btn">🔖 {post.isBookmarked ? 'Saved' : 'Save'}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'create' && (
        <div className="create-tab">
          <div className="create-header">
            <h2>Create New Community</h2>
            <p>Build a space for people with shared interests to connect and collaborate</p>
          </div>
          
          <CreateCommunityForm
            onSubmit={handleCreateCommunity}
            onCancel={() => setActiveTab('browse')}
          />
        </div>
      )}

      {showPostForm && selectedCommunity && (
        <CreatePostForm
          communityId={selectedCommunity.id}
          onSubmit={handleCreatePost}
          onCancel={() => setShowPostForm(false)}
        />
      )}
    </div>
  );
};

const CreateCommunityForm: React.FC<{
  onSubmit: (data: any) => void;
  onCancel: () => void;
}> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    category: '',
    tags: '',
    type: 'public',
    rules: '',
    settings: {
      allowPublicPosts: true,
      requireApproval: false,
      enableChat: true,
      enableEvents: true,
      enableResources: true,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      rules: formData.rules.split('\n').map(rule => rule.trim()).filter(Boolean),
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content large">
        <h2>Create New Community</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Community Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Short Description</label>
            <input
              type="text"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="Brief description for community listings"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Full Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="">Select a category</option>
                <option value="technology">Technology</option>
                <option value="business">Business</option>
                <option value="education">Education</option>
                <option value="gaming">Gaming</option>
                <option value="arts">Arts & Culture</option>
                <option value="health">Health & Wellness</option>
                <option value="sports">Sports</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="restricted">Restricted</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="programming, web development, javascript"
            />
          </div>
          
          <div className="form-group">
            <label>Community Rules (one per line)</label>
            <textarea
              value={formData.rules}
              onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
              rows={5}
              placeholder="Be respectful to all members&#10;No spam or self-promotion&#10;Stay on topic&#10;Help others when you can"
            />
          </div>
          
          <div className="form-group">
            <label>Community Settings</label>
            <div className="settings-grid">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.settings.allowPublicPosts}
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: { ...formData.settings, allowPublicPosts: e.target.checked }
                  })}
                />
                Allow public posts
              </label>
              
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.settings.requireApproval}
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: { ...formData.settings, requireApproval: e.target.checked }
                  })}
                />
                Require post approval
              </label>
              
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.settings.enableChat}
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: { ...formData.settings, enableChat: e.target.checked }
                  })}
                />
                Enable community chat
              </label>
              
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.settings.enableEvents}
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: { ...formData.settings, enableEvents: e.target.checked }
                  })}
                />
                Enable community events
              </label>
              
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.settings.enableResources}
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: { ...formData.settings, enableResources: e.target.checked }
                  })}
                />
                Enable resource sharing
              </label>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onCancel}>Cancel</button>
            <button type="submit">Create Community</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CreatePostForm: React.FC<{
  communityId: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}> = ({ communityId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'text',
    tags: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create New Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Post Title (optional)</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          
          <div className="form-group">
            <label>Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Post Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              >
                <option value="text">Text</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="link">Link</option>
                <option value="poll">Poll</option>
                <option value="event">Event</option>
                <option value="resource">Resource</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Tags (comma-separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="discussion, help, question"
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onCancel}>Cancel</button>
            <button type="submit">Create Post</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommunityManager;