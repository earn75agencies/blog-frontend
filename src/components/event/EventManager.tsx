import React, { useState, useEffect } from 'react';
import { eventService, Event, EventRegistration, EventSpeaker, EventSponsor } from '../../services/event.service';
import './EventManager.css';

interface EventManagerProps {
  userId: string;
}

const EventManager: React.FC<EventManagerProps> = ({ userId }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [speakers, setSpeakers] = useState<EventSpeaker[]>([]);
  const [sponsors, setSponsors] = useState<EventSponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'browse' | 'my-events' | 'my-registrations' | 'manage'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [eventsResponse, registrationsResponse] = await Promise.all([
        eventService.getEvents({ filter: 'upcoming' }),
        eventService.getUserRegistrations(),
      ]);
      
      setEvents(eventsResponse.events);
      setRegistrations(registrationsResponse.registrations);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEventDetails = async (event: Event) => {
    try {
      setSelectedEvent(event);
      const [speakersResponse, sponsorsResponse] = await Promise.all([
        eventService.getEventSpeakers(event.id),
        eventService.getEventSponsors(event.id),
      ]);
      
      setSpeakers(speakersResponse);
      setSponsors(sponsorsResponse);
    } catch (error) {
      console.error('Error loading event details:', error);
    }
  };

  const handleRegister = async (eventId: string) => {
    try {
      const registration = await eventService.registerForEvent(eventId);
      setRegistrations([...registrations, registration]);
      
      // Refresh events to update registered count
      const eventsResponse = await eventService.getEvents({ filter: 'upcoming' });
      setEvents(eventsResponse.events);
    } catch (error) {
      console.error('Error registering for event:', error);
    }
  };

  const handleCancelRegistration = async (eventId: string) => {
    try {
      await eventService.cancelRegistration(eventId);
      setRegistrations(registrations.filter(r => r.eventId !== eventId));
      
      // Refresh events to update registered count
      const eventsResponse = await eventService.getEvents({ filter: 'upcoming' });
      setEvents(eventsResponse.events);
    } catch (error) {
      console.error('Error canceling registration:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadInitialData();
      return;
    }

    try {
      const response = await eventService.searchEvents(searchQuery, {
        category: selectedCategory,
        type: selectedType,
        format: selectedFormat,
        free: priceRange === 'free',
      });
      setEvents(response.events);
    } catch (error) {
      console.error('Error searching events:', error);
    }
  };

  const handleCreateEvent = async (data: any) => {
    try {
      const newEvent = await eventService.createEvent(data);
      setEvents([...events, newEvent]);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: number, currency: string): string => {
    if (price === 0) return 'Free';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const isRegistered = (eventId: string): boolean => {
    return registrations.some(r => r.eventId === eventId);
  };

  const getRegistrationStatus = (eventId: string): EventRegistration | undefined => {
    return registrations.find(r => r.eventId === eventId);
  };

  if (loading) {
    return <div className="event-manager-loading">Loading events...</div>;
  }

  return (
    <div className="event-manager">
      <div className="manager-header">
        <h1>Event Manager</h1>
        <div className="manager-tabs">
          <button
            className={`tab-button ${activeTab === 'browse' ? 'active' : ''}`}
            onClick={() => setActiveTab('browse')}
          >
            Browse Events
          </button>
          <button
            className={`tab-button ${activeTab === 'my-events' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-events')}
          >
            My Events
          </button>
          <button
            className={`tab-button ${activeTab === 'my-registrations' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-registrations')}
          >
            My Registrations
          </button>
          <button
            className={`tab-button ${activeTab === 'manage' ? 'active' : ''}`}
            onClick={() => setActiveTab('manage')}
          >
            Manage
          </button>
        </div>
      </div>

      {activeTab === 'browse' && (
        <div className="browse-tab">
          <div className="search-controls">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search events..."
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
                <option value="networking">Networking</option>
                <option value="workshop">Workshop</option>
                <option value="conference">Conference</option>
                <option value="social">Social</option>
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="type-filter"
              >
                <option value="">All Types</option>
                <option value="online">Online</option>
                <option value="in-person">In-Person</option>
                <option value="hybrid">Hybrid</option>
              </select>

              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="format-filter"
              >
                <option value="">All Formats</option>
                <option value="conference">Conference</option>
                <option value="workshop">Workshop</option>
                <option value="webinar">Webinar</option>
                <option value="meetup">Meetup</option>
                <option value="networking">Networking</option>
                <option value="social">Social</option>
              </select>

              <div className="price-range">
                <span>Price: ${priceRange[0]} - ${priceRange[1]}</span>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                />
              </div>
            </div>
          </div>

          <div className="events-grid">
            {events.map((event) => (
              <div key={event.id} className="event-card">
                <div className="event-cover">
                  <img src={event.coverImage} alt={event.title} />
                  <div className="event-type">{event.type}</div>
                  <div className="event-format">{event.format}</div>
                </div>
                <div className="event-info">
                  <h3>{event.title}</h3>
                  <p className="event-organizer">by {event.organizer.username}</p>
                  <p className="event-description">{event.shortDescription}</p>
                  <div className="event-dates">
                    <div className="date-item">
                      <span className="date-label">Start:</span>
                      <span className="date-value">{formatDate(event.startDate)}</span>
                    </div>
                    <div className="date-item">
                      <span className="date-label">End:</span>
                      <span className="date-value">{formatDate(event.endDate)}</span>
                    </div>
                  </div>
                  <div className="event-location">
                    {event.type === 'online' ? (
                      <span>🌐 Online Event</span>
                    ) : event.type === 'hybrid' ? (
                      <span>🌐 {event.location?.city} + Online</span>
                    ) : (
                      <span>📍 {event.location?.city}</span>
                    )}
                  </div>
                  <div className="event-meta">
                    <span className="attendees">{event.registeredCount}/{event.capacity} attendees</span>
                    <span className="price">{formatPrice(event.price, event.currency)}</span>
                  </div>
                  <div className="event-tags">
                    {event.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                  <div className="event-actions">
                    <button
                      className="view-details-btn"
                      onClick={() => loadEventDetails(event)}
                    >
                      View Details
                    </button>
                    {!isRegistered(event.id) ? (
                      <button
                        className="register-btn"
                        onClick={() => handleRegister(event.id)}
                        disabled={event.registeredCount >= event.capacity}
                      >
                        {event.registeredCount >= event.capacity ? 'Full' : 'Register'}
                      </button>
                    ) : (
                      <button
                        className="cancel-btn"
                        onClick={() => handleCancelRegistration(event.id)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'my-registrations' && (
        <div className="my-registrations-tab">
          <h2>My Event Registrations</h2>
          <div className="registrations-grid">
            {registrations.map((registration) => (
              <div key={registration.id} className="registration-card">
                <div className="registration-cover">
                  <img src={registration.event.coverImage} alt={registration.event.title} />
                  <div className="registration-status">
                    {registration.status}
                  </div>
                </div>
                <div className="registration-info">
                  <h3>{registration.event.title}</h3>
                  <p className="event-organizer">by {registration.event.organizer.username}</p>
                  <div className="event-dates">
                    <span>{formatDate(registration.event.startDate)}</span>
                  </div>
                  <div className="registration-meta">
                    <span>Registered: {new Date(registration.registeredAt).toLocaleDateString()}</span>
                    <span>Status: {registration.status}</span>
                    <span>Payment: {registration.paymentStatus}</span>
                  </div>
                  <div className="registration-actions">
                    <button className="view-event-btn">View Event</button>
                    {registration.status === 'confirmed' && (
                      <button className="join-btn">Join Event</button>
                    )}
                    {registration.event.endDate < new Date().toISOString() && !registration.feedback && (
                      <button className="feedback-btn">Leave Feedback</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'my-events' && (
        <div className="my-events-tab">
          <div className="my-events-header">
            <h2>My Events</h2>
            <button
              className="create-event-btn"
              onClick={() => setShowCreateForm(true)}
            >
              + Create Event
            </button>
          </div>

          <div className="my-events-grid">
            {events
              .filter(event => event.organizer.id === userId)
              .map((event) => (
                <div key={event.id} className="my-event-card">
                  <div className="event-cover">
                    <img src={event.coverImage} alt={event.title} />
                    <div className="event-status">
                      {event.isPublished ? 'Published' : 'Draft'}
                    </div>
                  </div>
                  <div className="event-info">
                    <h3>{event.title}</h3>
                    <p>{event.shortDescription}</p>
                    <div className="event-stats">
                      <span>{event.registeredCount}/{event.capacity} registered</span>
                      <span>{formatPrice(event.price, event.currency)}</span>
                      <span>{event.format}</span>
                    </div>
                    <div className="event-actions">
                      <button onClick={() => loadEventDetails(event)}>Manage</button>
                      <button>Analytics</button>
                      <button>Attendees</button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {activeTab === 'manage' && selectedEvent && (
        <div className="manage-tab">
          <div className="manage-header">
            <h2>Manage Event: {selectedEvent.title}</h2>
            <div className="manage-tabs">
              <button className="manage-tab-btn active">Details</button>
              <button className="manage-tab-btn">Agenda</button>
              <button className="manage-tab-btn">Speakers</button>
              <button className="manage-tab-btn">Sponsors</button>
              <button className="manage-tab-btn">Attendees</button>
              <button className="manage-tab-btn">Analytics</button>
            </div>
          </div>

          <div className="manage-content">
            <div className="event-overview">
              <div className="overview-section">
                <h3>Event Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Type:</label>
                    <span>{selectedEvent.type}</span>
                  </div>
                  <div className="info-item">
                    <label>Format:</label>
                    <span>{selectedEvent.format}</span>
                  </div>
                  <div className="info-item">
                    <label>Category:</label>
                    <span>{selectedEvent.category}</span>
                  </div>
                  <div className="info-item">
                    <label>Capacity:</label>
                    <span>{selectedEvent.registeredCount}/{selectedEvent.capacity}</span>
                  </div>
                  <div className="info-item">
                    <label>Price:</label>
                    <span>{formatPrice(selectedEvent.price, selectedEvent.currency)}</span>
                  </div>
                  <div className="info-item">
                    <label>Status:</label>
                    <span>{selectedEvent.isPublished ? 'Published' : 'Draft'}</span>
                  </div>
                </div>
              </div>

              <div className="speakers-section">
                <h3>Speakers ({speakers.length})</h3>
                <div className="speakers-grid">
                  {speakers.map((speaker) => (
                    <div key={speaker.id} className="speaker-card">
                      <img src={speaker.avatar || '/default-avatar.png'} alt={speaker.name} />
                      <div className="speaker-info">
                        <h4>{speaker.name}</h4>
                        <p>{speaker.position}</p>
                        <p>{speaker.company}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sponsors-section">
                <h3>Sponsors ({sponsors.length})</h3>
                <div className="sponsors-grid">
                  {sponsors.map((sponsor) => (
                    <div key={sponsor.id} className="sponsor-card">
                      <img src={sponsor.logo} alt={sponsor.name} />
                      <div className="sponsor-info">
                        <h4>{sponsor.name}</h4>
                        <span className="sponsor-tier">{sponsor.tier}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreateForm && (
        <CreateEventForm
          onSubmit={handleCreateEvent}
          onCancel={() => setShowCreateForm(false)}
        />
      )}
    </div>
  );
};

const CreateEventForm: React.FC<{
  onSubmit: (data: any) => void;
  onCancel: () => void;
}> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: '',
    tags: '',
    type: 'online',
    format: 'webinar',
    location: {
      venue: '',
      address: '',
      city: '',
      country: '',
    },
    onlineDetails: {
      platform: '',
      meetingUrl: '',
      meetingId: '',
      password: '',
    },
    startDate: '',
    endDate: '',
    timezone: 'UTC',
    capacity: 100,
    price: 0,
    currency: 'USD',
    registrationDeadline: '',
    requirements: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      requirements: formData.requirements.split('\n').map(req => req.trim()).filter(Boolean),
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content large">
        <h2>Create New Event</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Event Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Short Description</label>
            <input
              type="text"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="Brief description for event listings"
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
                <option value="networking">Networking</option>
                <option value="workshop">Workshop</option>
                <option value="conference">Conference</option>
                <option value="social">Social</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              >
                <option value="online">Online</option>
                <option value="in-person">In-Person</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Format</label>
              <select
                value={formData.format}
                onChange={(e) => setFormData({ ...formData, format: e.target.value as any })}
              >
                <option value="conference">Conference</option>
                <option value="workshop">Workshop</option>
                <option value="webinar">Webinar</option>
                <option value="meetup">Meetup</option>
                <option value="networking">Networking</option>
                <option value="social">Social</option>
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
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Start Date & Time</label>
              <input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <label>End Date & Time</label>
              <input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Capacity</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                min="1"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                min="0"
                step="0.01"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Registration Deadline</label>
            <input
              type="datetime-local"
              value={formData.registrationDeadline}
              onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Requirements (one per line)</label>
            <textarea
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              rows={3}
              placeholder="Basic programming knowledge&#10;Laptop with internet connection&#10;Zoom account"
            />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onCancel}>Cancel</button>
            <button type="submit">Create Event</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventManager;