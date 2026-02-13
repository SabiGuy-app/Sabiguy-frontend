import { X, Trash2, Check } from "lucide-react";
import { FiMessageSquare, FiCalendar, FiBell } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";

export default function NotificationDrawer({
  isOpen,
  onClose,
  notifications,
  loading,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
}) {
  // Group notifications by date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const todayNotifications = notifications.filter((n) => {
    const notifDate = new Date(n.createdAt);
    notifDate.setHours(0, 0, 0, 0);
    return notifDate.getTime() === today.getTime();
  });

  const yesterdayNotifications = notifications.filter((n) => {
    const notifDate = new Date(n.createdAt);
    notifDate.setHours(0, 0, 0, 0);
    return notifDate.getTime() === yesterday.getTime();
  });

  const olderNotifications = notifications.filter((n) => {
    const notifDate = new Date(n.createdAt);
    notifDate.setHours(0, 0, 0, 0);
    return notifDate.getTime() < yesterday.getTime();
  });

  const getIcon = (type) => {
    const iconMap = {
      new_booking_request: <FiCalendar className="text-blue-500" size={20} />,
      provider_accepted: <FiCalendar className="text-green-500" size={20} />,
      booking_selected: <FiCalendar className="text-blue-500" size={20} />,
      booking_taken: <FiCalendar className="text-purple-500" size={20} />,
      booking_cancelled: <FiCalendar className="text-red-500" size={20} />,
      job_started: <FiCalendar className="text-orange-500" size={20} />,
      payment_received: <FiBell className="text-green-500" size={20} />,
      booking_completed: <FiCalendar className="text-green-500" size={20} />,
      message_received: <FiMessageSquare className="text-orange-500" size={20} />,
      new_message: <FiMessageSquare className="text-orange-500" size={20} />,
      counter_offer: <FiBell className="text-blue-500" size={20} />,
      job_completed_confirmed: <FiCalendar className="text-green-500" size={20} />,
      test: <FiBell className="text-gray-500" size={20} />,
    };
    return iconMap[type] || <FiBell className="text-gray-500" size={20} />;
  };

  const NotificationItem = ({ notification }) => (
    <div
      className={`flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer relative ${
        !notification.read ? "bg-blue-50" : ""
      }`}
    >
      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
        {getIcon(notification.type)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="font-semibold text-gray-900 text-sm">
            {notification.title}
          </h4>
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">
          {notification.message}
        </p>
        
        {/* Action buttons */}
        <div className="flex items-center gap-2 mt-2">
          {!notification.read && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead(notification._id);
              }}
              className="text-xs text-[#005823] hover:underline flex items-center gap-1"
            >
              <Check size={14} />
              Mark as read
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(notification._id);
            }}
            className="text-xs text-red-500 hover:underline flex items-center gap-1"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>
      {!notification.read && (
        <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full"></div>
      )}
    </div>
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 bg-opacity-20 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      <div
        className={`
          fixed top-0 right-0 h-full w-[90%] md:w-[450px]
          bg-white shadow-xl z-50 rounded-l-3xl
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold">Notification</h2>
            {unreadCount > 0 && (
              <p className="text-xs text-gray-500">{unreadCount} unread</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-xs text-[#005823] hover:underline"
              >
                Mark all read
              </button>
            )}
            <button onClick={onClose}>
              <X size={22} />
            </button>
          </div>
        </div>

        <div className="h-[calc(100%-60px)] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005823]" />
            </div>
          ) : notifications.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FiBell className="text-gray-400" size={28} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No notifications yet
              </h3>
              <p className="text-sm text-gray-500">
                You'll see notifications here when you have updates
              </p>
            </div>
          ) : (
            <>
              {/* Today's Notifications */}
              {todayNotifications.length > 0 && (
                <div className="p-6">
                  <h3 className="text-sm font-semibold text-gray-600 mb-4">
                    Today
                  </h3>
                  <div className="space-y-4">
                    {todayNotifications.map((notification) => (
                      <NotificationItem
                        key={notification._id}
                        notification={notification}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Yesterday's Notifications */}
              {yesterdayNotifications.length > 0 && (
                <div className="p-6">
                  <h3 className="text-sm font-semibold text-gray-600 mb-4">
                    Yesterday
                  </h3>
                  <div className="space-y-4">
                    {yesterdayNotifications.map((notification) => (
                      <NotificationItem
                        key={notification._id}
                        notification={notification}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Older Notifications */}
              {olderNotifications.length > 0 && (
                <div className="p-6">
                  <h3 className="text-sm font-semibold text-gray-600 mb-4">
                    Older
                  </h3>
                  <div className="space-y-4">
                    {olderNotifications.map((notification) => (
                      <NotificationItem
                        key={notification._id}
                        notification={notification}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}