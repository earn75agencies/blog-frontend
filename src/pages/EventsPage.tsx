import { useState } from 'react';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { FiCalendar, FiClock, FiMapPin, FiUsers } from 'react-icons/fi';
import eventService, { Event } from '../services/event.service';

const EventsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming');

  const { data: eventData, isLoading } = useQuery(['events', filter], async () => {
    return await eventService.getEvents({ filter, limit: 12 });
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" variant="warning" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Events</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-lg ${filter === 'upcoming' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-4 py-2 rounded-lg ${filter === 'past' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
          >
            Past
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
          >
            All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventData?.events?.map((event) => (
          <Card key={event._id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/events/${event._id}`)}>
            {event.image && (
              <img src={event.image} alt={event.title} className="w-full h-48 object-cover rounded-t-lg" />
            )}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="primary">{event.category}</Badge>
                {event.status && (
                  <Badge variant={event.status === 'upcoming' ? 'success' : event.status === 'completed' ? 'secondary' : 'warning'}>
                    {event.status}
                  </Badge>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2">{event.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-2">
                  <FiCalendar />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiClock />
                  <span>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiMapPin />
                  <span>{event.virtualLocation || event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiUsers />
                  <span>{event.attendees} {event.maxAttendees ? `/ ${event.maxAttendees}` : ''} attendees</span>
                </div>
              </div>
              {event.price && event.price > 0 && (
                <div className="mb-4">
                  <span className="text-lg font-bold text-primary-600">
                    {event.currency || '$'}{event.price}
                  </span>
                </div>
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/events/${event._id}`);
                }}
              >
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {eventData?.events && eventData.events.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No events found for this filter.</p>
        </div>
      )}
    </div>
  );
};

export default EventsPage;


