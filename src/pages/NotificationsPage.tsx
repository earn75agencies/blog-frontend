import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { useTranslation } from 'react-i18next';
import notificationService from '../services/notification.service';
import { Notification } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Pagination from '../components/ui/Pagination';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { FiCheck, FiCheckCircle, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const NotificationsPage = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    ['notifications', page, filter],
    () => notificationService.getNotifications(page, 20, filter === 'unread'),
    { enabled: true }
  );

  const markAsReadMutation = useMutation(
    (id: string) => notificationService.markAsRead(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications');
        queryClient.invalidateQueries('unreadNotifications');
      },
    }
  );

  const markAllAsReadMutation = useMutation(
    () => notificationService.markAllAsRead(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications');
        queryClient.invalidateQueries('unreadNotifications');
        toast.success('All notifications marked as read');
      },
    }
  );

  const deleteMutation = useMutation(
    (id: string) => notificationService.deleteNotification(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications');
        queryClient.invalidateQueries('unreadNotifications');
        toast.success('Notification deleted');
      },
    }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'unread')}
            className="input w-32"
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
          </select>
          {unreadCount > 0 && (
            <Button
              onClick={() => markAllAsReadMutation.mutate()}
              isLoading={markAllAsReadMutation.isLoading}
              leftIcon={<FiCheckCircle />}
              size="sm"
            >
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {notifications.length > 0 ? (
        <>
          <div className="space-y-3">
            {notifications.map((notification: Notification) => (
              <div
                key={notification._id}
                className={`card ${!notification.isRead ? 'bg-primary-50 border-primary-200' : ''}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{notification.title}</h3>
                      {!notification.isRead && (
                        <Badge variant="primary" size="sm">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-700 mb-2">{notification.message}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>
                        {formatDistance(
                          new Date(notification.createdAt),
                          new Date(),
                          { addSuffix: true }
                        )}
                      </span>
                      {notification.type && (
                        <Badge variant="secondary" size="sm">
                          {notification.type.replace('_', ' ')}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsReadMutation.mutate(notification._id)}
                        className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
                        title="Mark as read"
                      >
                        <FiCheck className="text-primary-600" />
                      </button>
                    )}
                    {notification.link && (
                      <Link
                        to={notification.link}
                        className="btn btn-outline btn-sm"
                        onClick={() => {
                          if (!notification.isRead) {
                            markAsReadMutation.mutate(notification._id);
                          }
                        }}
                      >
                        View
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        if (confirm('Delete this notification?')) {
                          deleteMutation.mutate(notification._id);
                        }
                      }}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {data?.pagination && data.pagination.pages > 1 && (
            <Pagination
              currentPage={data.pagination.page}
              totalPages={data.pagination.pages}
              onPageChange={setPage}
            />
          )}
        </>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg">No notifications found</p>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;

