import { X, Trash2, Check, Loader2, Eye } from "lucide-react";
import { FiMessageSquare, FiCalendar, FiBell } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ActivityDetailsModal from "./ActivityDetailsModal";

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
  const navigate = useNavigate();
  const [markingAsRead, setMarkingAsRead] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Filter to only show UNREAD notifications
  const unreadNotifications = notifications.filter((n) => !n.isRead);

  // Group notifications by date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const todayNotifications = unreadNotifications.filter((n) => {
    const notifDate = new Date(n.createdAt);
    notifDate.setHours(0, 0, 0, 0);
    return notifDate.getTime() === today.getTime();
  });

  const yesterdayNotifications = unreadNotifications.filter((n) => {
    const notifDate = new Date(n.createdAt);
    notifDate.setHours(0, 0, 0, 0);
    return notifDate.getTime() === yesterday.getTime();
  });

  const olderNotifications = unreadNotifications.filter((n) => {
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
      message_received: (
        <FiMessageSquare className="text-orange-500" size={20} />
      ),
      new_message: <FiMessageSquare className="text-orange-500" size={20} />,
      counter_offer: <FiBell className="text-blue-500" size={20} />,
      job_completed_confirmed: (
        <FiCalendar className="text-green-500" size={20} />
      ),
      test: <FiBell className="text-gray-500" size={20} />,
    };
    return iconMap[type] || <FiBell className="text-gray-500" size={20} />;
  };

  const handleNotificationClick = async (notification) => {
    // Set marking as read state
    setMarkingAsRead(notification._id);

    // Call the mark as read function
    await onMarkAsRead(notification._id);

    onClose();

    // Route to hire alert page for new_booking_request type
    if (notification.type === "new_booking_request") {
      navigate("/dashboard/provider/hire-alert", {
        state: {
          bookingData: notification.data,
          tab: "alert",
        },
      });
    }
    // Route to chat page for new_message type
    else if (
      notification.type === "new_message" ||
      notification.type === "message_received"
    ) {
      if (notification.messageId) {
        navigate(`/dashboard/chat?messageId=${notification.messageId}`);
      } else if (notification.data?.chatId) {
        navigate(`/dashboard/chat?chatId=${notification.data.chatId}`);
      } else if (notification.data?.bookingId) {
        navigate(`/dashboard/chat?bookingId=${notification.data.bookingId}`);
      } else {
        navigate("/dashboard/chat");
      }
    }

    // Reset marking state
    setMarkingAsRead(null);
  };

  const handleViewDetails = async (e, notification) => {
    e.stopPropagation();
    // Close the drawer first so modal is fully visible
    onClose();
    // Open the details modal (do NOT mark as read — let user do that explicitly)
    setSelectedNotification(notification);
  };

  const handleMarkAsRead = async (e, notificationId) => {
    e.stopPropagation();
    setMarkingAsRead(notificationId);
    await onMarkAsRead(notificationId);
    setMarkingAsRead(null);
  };

  const handleDelete = async (e, notificationId) => {
    e.stopPropagation();
    setDeleting(notificationId);
    await onDelete(notificationId);
    setDeleting(null);
  };

  const NotificationItem = ({ notification }) => {
    const isMarkingAsRead = markingAsRead === notification._id;
    const isDeleting = deleting === notification._id;
    const isProcessing = isMarkingAsRead || isDeleting;

    return (
      <div
        onClick={() => !isProcessing && handleNotificationClick(notification)}
        className={`flex items-start gap-4 p-4 rounded-lg transition-all cursor-pointer relative group ${isProcessing
          ? "opacity-50 bg-gray-100"
          : "hover:bg-gray-50 bg-blue-50"
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

          {/* Loading/Action states */}
          {isMarkingAsRead && (
            <div className="flex items-center gap-2 mt-2 text-xs text-blue-600">
              <Loader2 size={14} className="animate-spin" />
              Marking as read...
            </div>
          )}
          {isDeleting && (
            <div className="flex items-center gap-2 mt-2 text-xs text-red-600">
              <Loader2 size={14} className="animate-spin" />
              Deleting...
            </div>
          )}

          {/* Action buttons - only show when not processing */}
          {!isProcessing && (
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={(e) => handleViewDetails(e, notification)}
                className="text-xs text-[#005823] hover:underline flex items-center gap-1 font-medium"
              >
                <Eye size={14} />
                View Details
              </button>
              <button
                onClick={(e) => handleMarkAsRead(e, notification._id)}
                className="text-xs text-[#005823] hover:underline flex items-center gap-1"
              >
                <Check size={14} />
                Mark as read
              </button>
              <button
                onClick={(e) => handleDelete(e, notification._id)}
                className="text-xs text-red-500 hover:underline flex items-center gap-1"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          )}
        </div>
        <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full"></div>
      </div>
    );
  };

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
            <h2 className="text-lg font-semibold">Notifications</h2>
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
          ) : unreadNotifications.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FiBell className="text-gray-400" size={28} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                All caught up!
              </h3>
              <p className="text-sm text-gray-500">
                You have no unread notifications
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

      {/* Activity Details Modal */}
      <ActivityDetailsModal
        isOpen={!!selectedNotification}
        onClose={() => setSelectedNotification(null)}
        notification={selectedNotification}
      />
    </>
  );
}
