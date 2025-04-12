import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BellIcon } from '@heroicons/react/24/outline';
import { format, isToday, isTomorrow } from 'date-fns';

const NotificationsMenu = ({ notifications, setNotifications }) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    let dayStr = '';
    if (isToday(date)) {
      dayStr = 'Today';
    } else if (isTomorrow(date)) {
      dayStr = 'Tomorrow';
    } else {
      dayStr = format(date, 'MMM d');
    }
    return `${dayStr} at ${format(date, 'h:mm a')}`;
  };

  const handleDismiss = (notificationId) => {
    setNotifications(notifications.filter(n => n.id !== notificationId));
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, status: 'read' } : n
    ));
  };

  const pendingNotifications = notifications.filter(n => n.status === 'pending');

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-full p-2 hover:bg-gray-100"
      >
        <BellIcon className="h-6 w-6" />
        {pendingNotifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {pendingNotifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50">
          <div className="py-2 px-4 bg-gray-50 border-b">
            <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-4 px-4 text-sm text-gray-500 text-center">
                No notifications
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 ${
                      notification.status === 'pending'
                        ? 'bg-blue-50'
                        : 'bg-white'
                    }`}
                  >
                    <p className="text-sm text-gray-800">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDateTime(notification.scheduled_time)}
                    </p>
                    <div className="mt-2 flex justify-end space-x-2">
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Mark as Read
                      </button>
                      <button
                        onClick={() => handleDismiss(notification.id)}
                        className="text-xs text-gray-600 hover:text-gray-800"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

NotificationsMenu.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      scheduled_time: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
  setNotifications: PropTypes.func.isRequired,
};

export default NotificationsMenu;