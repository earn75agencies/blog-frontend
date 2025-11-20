import { useQuery, useMutation, useQueryClient } from 'react-query';
import { formatDistance } from 'date-fns';
import notificationService from '../../services/notification.service';
import { Notification } from '../../types';
import LoadingSpinner from '../ui/LoadingSpinner';
import { FiX, FiCheck } from 'react-icons/fi';
import { Link } from 'react-router-dom';

interface NotificationDropdownProps {
  onClose: () => void;
}

const NotificationDropdown = ({ onClose }: NotificationDropdownProps) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery('notifications', () =>
    notificationService.getNotifications(1, 10)
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
      },
    }
  );

  const notifications = data?.notifications || [];

  return (
    <>
      <div
        className="fixed inset-0 z-10"
        onClick={onClose}
      />
      <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-20 max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold">Notifications</h3>
          <div className="flex items-center gap-2">
            {notifications.some((n: Notification) => !n.isRead) && (
              <button
                onClick={() => markAllAsReadMutation.mutate()}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Mark all as read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <FiX />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div>
          {isLoading ? (
            <div className="p-4 flex justify-center">
              <LoadingSpinner />
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notification: Notification) => (
              <div
                key={notification._id}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  !notification.isRead ? 'bg-primary-50' : ''
                }`}
              >
                {notification.link ? (
                  <Link
                    to={notification.link}
                    onClick={() => {
                      if (!notification.isRead) {
                        markAsReadMutation.mutate(notification._id);
                      }
                      onClose();
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDistance(new Date(notification.createdAt), new Date(), { addSuffix: true })}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                  </Link>
                ) : (
                  <div
                    onClick={() => {
                      if (!notification.isRead) {
                        markAsReadMutation.mutate(notification._id);
                      }
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDistance(new Date(notification.createdAt), new Date(), { addSuffix: true })}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsReadMutation.mutate(notification._id);
                          }}
                          className="flex-shrink-0 p-1 hover:bg-primary-100 rounded-full"
                        >
                          <FiCheck className="text-primary-600 text-sm" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p>No notifications</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-gray-200 text-center">
            <Link
              to="/notifications"
              className="text-sm text-primary-600 hover:text-primary-700"
              onClick={onClose}
            >
              View all notifications
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationDropdown;

