import ProviderDashboardLayout from "../../../components/layouts/ProviderDashboardLayout";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { FiSearch, FiCalendar, FiDollarSign, FiMessageSquare, FiBell } from "react-icons/fi";
import { useState, useEffect } from "react";
import TabNavigation from "../../../components/dashboard/TabNav";
import Activities from "../../../components/dashboard/Activities";
import ActivityDetailsModal from "../../../components/dashboard/ActivityDetailsModal";
import { notificationService } from "../../../api/notifications";

const ITEMS_PER_PAGE = 10;

// Map tabs to notification type groups
const TAB_TYPE_MAP = {
  All: null,
  Bookings: [
    "new_booking_request",
    "provider_accepted",
    "booking_selected",
    "booking_taken",
    "booking_cancelled",
    "booking_completed",
    "job_started",
    "job_completed_confirmed",
  ],
  Payments: ["payment_received"],
  Updates: ["new_message", "message_received", "counter_offer", "test"],
};

// Tab-specific empty state config
const EMPTY_STATE_CONFIG = {
  All: {
    icon: FiBell,
    title: "No activity yet",
    message: "Your recent activity will appear here once you start using the platform.",
  },
  Bookings: {
    icon: FiCalendar,
    title: "No booking activity",
    message: "Booking updates will show up here when you make or receive bookings.",
  },
  Payments: {
    icon: FiDollarSign,
    title: "No payment activity",
    message: "Payment notifications will appear here after transactions.",
  },
  Updates: {
    icon: FiMessageSquare,
    title: "No updates",
    message: "Messages and other updates will be shown here.",
  },
};

// Skeleton loader for activity items
function ActivitySkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="w-8 h-8 bg-gray-200 rounded-lg flex-shrink-0"></div>
      </div>
    </div>
  );
}

const ProviderActivity = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const tabs = ["All", "Bookings", "Payments", "Updates"];

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Reset to page 1 when tab or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await notificationService.fetchNotifications();
      setNotifications(res?.data?.notifications || res?.data || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError("Failed to load activity. Please try again.");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Failed to delete notification:", err);
      throw err;
    }
  };

  // Filter by tab
  const tabTypes = TAB_TYPE_MAP[activeTab];
  const tabFiltered = tabTypes
    ? notifications.filter((n) => tabTypes.includes(n.type))
    : notifications;

  // Filter by search
  const searchFiltered = searchQuery.trim()
    ? tabFiltered.filter(
      (n) =>
        (n.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.message || "").toLowerCase().includes(searchQuery.toLowerCase())
    )
    : tabFiltered;

  // Pagination
  const totalPages = Math.max(1, Math.ceil(searchFiltered.length / ITEMS_PER_PAGE));
  const paginatedItems = searchFiltered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Empty state config for current tab
  const emptyConfig = EMPTY_STATE_CONFIG[activeTab];
  const EmptyIcon = emptyConfig.icon;

  return (
    <ProviderDashboardLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="font-bold text-2xl">Activity</h1>
      </div>

      {/* Tabs */}
      <div className="mb-6 mt-6">
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <FiSearch
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search activity"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent bg-white text-sm"
            aria-label="Search activity"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-3">
        {loading ? (
          <>
            <ActivitySkeleton />
            <ActivitySkeleton />
            <ActivitySkeleton />
            <ActivitySkeleton />
          </>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <X size={24} className="text-red-500" />
            </div>
            <p className="text-red-600 font-medium mb-1">Something went wrong</p>
            <p className="text-sm text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchNotifications}
              className="px-5 py-2.5 text-sm font-medium text-white bg-[#005823] rounded-lg hover:bg-[#004019] transition-colors"
            >
              Retry
            </button>
          </div>
        ) : paginatedItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <EmptyIcon size={24} className="text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              {searchQuery ? "No results found" : emptyConfig.title}
            </h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              {searchQuery
                ? `No activity matches "${searchQuery}". Try a different search term.`
                : emptyConfig.message}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 px-4 py-2 text-sm font-medium text-[#005823] border border-[#005823] rounded-lg hover:bg-[#005823] hover:text-white transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          paginatedItems.map((notification) => (
            <Activities
              key={notification._id}
              notification={notification}
              onDelete={handleDelete}
              onViewDetails={setSelectedNotification}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {!loading && searchFiltered.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-between px-6 py-4 mt-4 bg-white rounded-lg border border-gray-200">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 hidden sm:inline">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, searchFiltered.length)} of {searchFiltered.length}
            </span>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center text-sm rounded-lg transition-colors ${currentPage === page
                      ? "bg-[#005823] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}
                    aria-label={`Page ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Activity Details Modal */}
      <ActivityDetailsModal
        isOpen={!!selectedNotification}
        onClose={() => setSelectedNotification(null)}
        notification={selectedNotification}
      />
    </ProviderDashboardLayout>
  );
};

export default ProviderActivity;
