import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import eventService from '../services/event.service';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiArrowLeft } from 'react-icons/fi';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();

  const { data: event, isLoading } = useQuery(
    ['event', id],
    () => eventService.getEvent(id!),
    { enabled: !!id }
  );

  const handleRegister = async () => {
    if (!isAuthenticated) {
      toast.error(t('events.loginRequired') || 'Please login to register for events');
      navigate('/login');
      return;
    }

    try {
      await eventService.registerForEvent(id!);
      toast.success(t('events.registered') || 'Successfully registered for event!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('events.registrationFailed') || 'Failed to register for event');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" variant="warning" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-4">{t('events.notFound') || 'Event not found'}</p>
        <Button onClick={() => navigate('/events')}>
          <FiArrowLeft className="inline mr-2" />
          {t('events.backToEvents') || 'Back to Events'}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="outline"
        onClick={() => navigate('/events')}
        className="mb-6"
      >
        <FiArrowLeft className="inline mr-2" />
        {t('events.backToEvents') || 'Back to Events'}
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {event.image && (
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          )}

          <Card className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="primary">{event.category}</Badge>
              {event.status && (
                <Badge
                  variant={
                    event.status === 'upcoming'
                      ? 'success'
                      : event.status === 'completed'
                      ? 'secondary'
                      : 'warning'
                  }
                >
                  {event.status}
                </Badge>
              )}
            </div>

            <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
            <p className="text-gray-700 text-lg leading-relaxed">{event.description}</p>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6">{t('events.eventDetails') || 'Event Details'}</h2>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <FiCalendar className="text-primary-600 mt-1" />
                <div>
                  <p className="font-medium">{t('events.date') || 'Date'}</p>
                  <p className="text-gray-600">{new Date(event.date || event.startDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiClock className="text-primary-600 mt-1" />
                <div>
                  <p className="font-medium">{t('events.time') || 'Time'}</p>
                  <p className="text-gray-600">
                    {new Date(event.date || event.startDate).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiMapPin className="text-primary-600 mt-1" />
                <div>
                  <p className="font-medium">{t('events.location') || 'Location'}</p>
                  <p className="text-gray-600">
                    {event.virtualLocation || (typeof event.location === 'string' ? event.location : event.location?.venue || 'TBD')}
                  </p>
                  {event.virtualLocation && (
                    <Badge variant="info" className="mt-1">
                      {t('events.virtual') || 'Virtual'}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiUsers className="text-primary-600 mt-1" />
                <div>
                  <p className="font-medium">{t('events.attendees') || 'Attendees'}</p>
                  <p className="text-gray-600">
                    {event.attendees} {event.maxAttendees ? `/ ${event.maxAttendees}` : ''}
                  </p>
                </div>
              </div>

              {event.price !== undefined && event.price > 0 && (
                <div>
                  <p className="font-medium">{t('events.price') || 'Price'}</p>
                  <p className="text-2xl font-bold text-primary-600">
                    {event.currency || '$'}
                    {event.price}
                  </p>
                </div>
              )}
            </div>

            <Button
              onClick={handleRegister}
              className="w-full"
              disabled={event.status !== 'upcoming'}
            >
              {event.status === 'upcoming'
                ? t('events.register') || 'Register for Event'
                : t('events.registrationClosed') || 'Registration Closed'}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;


