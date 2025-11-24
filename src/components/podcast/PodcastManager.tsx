import React, { useState, useEffect } from 'react';
import { podcastService, Podcast, Episode } from '../../services/podcast.service';
import PodcastPlayer from './PodcastPlayer';
import './PodcastManager.css';

interface PodcastManagerProps {
  userId: string;
}

const PodcastManager: React.FC<PodcastManagerProps> = ({ userId }) => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'browse' | 'my-podcasts' | 'player'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEpisodeForm, setShowEpisodeForm] = useState(false);

  useEffect(() => {
    loadPodcasts();
  }, []);

  const loadPodcasts = async () => {
    try {
      setLoading(true);
      const response = await podcastService.getAllPodcasts();
      setPodcasts(response.podcasts);
    } catch (error) {
      console.error('Error loading podcasts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEpisodes = async (podcastId: string) => {
    try {
      const response = await podcastService.getPodcastEpisodes(podcastId);
      setEpisodes(response.episodes);
    } catch (error) {
      console.error('Error loading episodes:', error);
    }
  };

  const handlePodcastSelect = (podcast: Podcast) => {
    setSelectedPodcast(podcast);
    loadEpisodes(podcast.id);
  };

  const handleEpisodeSelect = (episode: Episode) => {
    setSelectedEpisode(episode);
    setActiveTab('player');
  };

  const handleCreatePodcast = async (data: any) => {
    try {
      const newPodcast = await podcastService.createPodcast(data);
      setPodcasts([...podcasts, newPodcast]);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating podcast:', error);
    }
  };

  const handleCreateEpisode = async (data: any) => {
    if (!selectedPodcast) return;
    
    try {
      const newEpisode = await podcastService.createEpisode(selectedPodcast.id, data);
      setEpisodes([...episodes, newEpisode]);
      setShowEpisodeForm(false);
    } catch (error) {
      console.error('Error creating episode:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadPodcasts();
      return;
    }

    try {
      const response = await podcastService.searchPodcasts(searchQuery);
      setPodcasts(response.podcasts);
    } catch (error) {
      console.error('Error searching podcasts:', error);
    }
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (loading) {
    return <div className="podcast-manager-loading">Loading podcasts...</div>;
  }

  return (
    <div className="podcast-manager">
      <div className="manager-header">
        <h1>Podcast Manager</h1>
        <div className="manager-tabs">
          <button
            className={`tab-button ${activeTab === 'browse' ? 'active' : ''}`}
            onClick={() => setActiveTab('browse')}
          >
            Browse
          </button>
          <button
            className={`tab-button ${activeTab === 'my-podcasts' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-podcasts')}
          >
            My Podcasts
          </button>
          {selectedEpisode && (
            <button
              className={`tab-button ${activeTab === 'player' ? 'active' : ''}`}
              onClick={() => setActiveTab('player')}
            >
              Now Playing
            </button>
          )}
        </div>
      </div>

      {activeTab === 'browse' && (
        <div className="browse-tab">
          <div className="search-controls">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search podcasts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button onClick={handleSearch}>Search</button>
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-filter"
            >
              <option value="">All Categories</option>
              <option value="technology">Technology</option>
              <option value="business">Business</option>
              <option value="education">Education</option>
              <option value="entertainment">Entertainment</option>
              <option value="news">News</option>
              <option value="sports">Sports</option>
              <option value="comedy">Comedy</option>
            </select>

            <button
              className="create-button"
              onClick={() => setShowCreateForm(true)}
            >
              + Create Podcast
            </button>
          </div>

          <div className="podcasts-grid">
            {podcasts.map((podcast) => (
              <div key={podcast.id} className="podcast-card">
                <div className="podcast-cover">
                  <img src={podcast.coverArt} alt={podcast.title} />
                </div>
                <div className="podcast-info">
                  <h3>{podcast.title}</h3>
                  <p className="podcast-author">by {podcast.author.username}</p>
                  <p className="podcast-description">{podcast.description}</p>
                  <div className="podcast-meta">
                    <span className="episodes-count">{podcast.totalEpisodes} episodes</span>
                    <span className="duration">{formatDuration(podcast.totalDuration)}</span>
                    <span className="rating">⭐ {podcast.rating.toFixed(1)}</span>
                  </div>
                  <div className="podcast-tags">
                    {podcast.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                  <button
                    className="view-episodes-btn"
                    onClick={() => handlePodcastSelect(podcast)}
                  >
                    View Episodes
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'my-podcasts' && (
        <div className="my-podcasts-tab">
          <div className="my-podcasts-header">
            <h2>My Podcasts</h2>
            <button
              className="create-button"
              onClick={() => setShowCreateForm(true)}
            >
              + Create New Podcast
            </button>
          </div>

          {selectedPodcast && (
            <div className="selected-podcast">
              <div className="podcast-header">
                <div className="podcast-cover">
                  <img src={selectedPodcast.coverArt} alt={selectedPodcast.title} />
                </div>
                <div className="podcast-details">
                  <h2>{selectedPodcast.title}</h2>
                  <p>{selectedPodcast.description}</p>
                  <div className="podcast-stats">
                    <span>{selectedPodcast.totalEpisodes} episodes</span>
                    <span>{selectedPodcast.subscriberCount} subscribers</span>
                    <span>⭐ {selectedPodcast.rating.toFixed(1)}</span>
                  </div>
                  <button
                    className="create-episode-btn"
                    onClick={() => setShowEpisodeForm(true)}
                  >
                    + Create Episode
                  </button>
                </div>
              </div>

              <div className="episodes-list">
                <h3>Episodes</h3>
                {episodes.map((episode) => (
                  <div key={episode.id} className="episode-item">
                    <div className="episode-info">
                      <h4>{episode.title}</h4>
                      <p>{episode.description}</p>
                      <div className="episode-meta">
                        <span>Episode {episode.episodeNumber}</span>
                        {episode.seasonNumber && <span>Season {episode.seasonNumber}</span>}
                        <span>{formatDuration(episode.duration)}</span>
                        <span>{episode.playCount} plays</span>
                        <span>{new Date(episode.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="episode-actions">
                      <button
                        className="play-btn"
                        onClick={() => handleEpisodeSelect(episode)}
                      >
                        ▶️ Play
                      </button>
                      <button className="edit-btn">✏️ Edit</button>
                      <button className="delete-btn">🗑️ Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!selectedPodcast && (
            <div className="no-podcast-selected">
              <p>Select a podcast to view and manage episodes</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'player' && selectedEpisode && (
        <div className="player-tab">
          <PodcastPlayer
            episode={selectedEpisode}
            onProgressUpdate={(progress) => {
              console.log('Episode progress:', progress);
            }}
            onEpisodeEnd={() => {
              console.log('Episode ended');
            }}
          />
        </div>
      )}

      {showCreateForm && (
        <CreatePodcastForm
          onSubmit={handleCreatePodcast}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {showEpisodeForm && selectedPodcast && (
        <CreateEpisodeForm
          podcastId={selectedPodcast.id}
          onSubmit={handleCreateEpisode}
          onCancel={() => setShowEpisodeForm(false)}
        />
      )}
    </div>
  );
};

const CreatePodcastForm: React.FC<{
  onSubmit: (data: any) => void;
  onCancel: () => void;
}> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    language: 'en',
    website: '',
    rssFeed: '',
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
        <h2>Create New Podcast</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          
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
              <option value="entertainment">Entertainment</option>
              <option value="news">News</option>
              <option value="sports">Sports</option>
              <option value="comedy">Comedy</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="tech, programming, development"
            />
          </div>
          
          <div className="form-group">
            <label>Language</label>
            <select
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Website (optional)</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
          </div>
          
          <div className="form-group">
            <label>RSS Feed (optional)</label>
            <input
              type="url"
              value={formData.rssFeed}
              onChange={(e) => setFormData({ ...formData, rssFeed: e.target.value })}
            />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onCancel}>Cancel</button>
            <button type="submit">Create Podcast</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CreateEpisodeForm: React.FC<{
  podcastId: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}> = ({ podcastId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    episodeNumber: '',
    seasonNumber: '',
    showNotes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      episodeNumber: parseInt(formData.episodeNumber),
      seasonNumber: formData.seasonNumber ? parseInt(formData.seasonNumber) : undefined,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create New Episode</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Content/Transcript</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={10}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Episode Number</label>
              <input
                type="number"
                value={formData.episodeNumber}
                onChange={(e) => setFormData({ ...formData, episodeNumber: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Season Number (optional)</label>
              <input
                type="number"
                value={formData.seasonNumber}
                onChange={(e) => setFormData({ ...formData, seasonNumber: e.target.value })}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Show Notes (optional)</label>
            <textarea
              value={formData.showNotes}
              onChange={(e) => setFormData({ ...formData, showNotes: e.target.value })}
              rows={5}
            />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onCancel}>Cancel</button>
            <button type="submit">Create Episode</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PodcastManager;