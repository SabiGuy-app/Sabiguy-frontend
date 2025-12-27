import { X } from "lucide-react";
import { FiMessageSquare, FiCalendar, FiBell } from "react-icons/fi";
import { useState } from "react";

export default function NotificationDrawer ({ isOpen, onClose, notifications }) {
const todayNotifications = notifications.filter(n => n.category === "today");
  const yesterdayNotifications = notifications.filter(n => n.category === "yesterday");

  const getIcon = (type) => {
    switch (type) {
      case "message":
        return <FiBell className="text-orange-500" size={20}/>;
      case "event":
        return <FiCalendar className="text-blue-500" size={20}/>
      case "booking":
        return <FiCalendar className="text-blue-500" size={20}/>    
      default:
        return <FiBell className="text-gray-500" size={20}/>
    }
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
  `}>
    <div className="flex items-center  justify-between px-5 py-4 border-b border-gray-200">

<h2 className="text-lg font-semibold">Notification</h2>
<button onClick={onClose}
>  <X size={22}/>
</button>
    </div>
    <div className="h-[calc(100%-60px)] overflow-y-auto">
      {todayNotifications.length > 0 && (
        <div className="p-6">
        <h3 className="text-sm font-semibold text-gray-600 mb-4">Today</h3>
        <div className="space-y-4">
          {todayNotifications.map((notification) => (
            <div
            key={notification.id}
            className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
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
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                  </div>
            
          ))}
          </div>
          </div>

      )}
       {/* Empty State */}
          {notifications.length === 0 && (
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
          )}
      </div>

        </div>
        </>
    )
}