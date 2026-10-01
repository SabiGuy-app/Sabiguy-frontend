import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  FiBell,
  FiCalendar,
  FiDollarSign,
  FiMessageSquare,
  FiSearch,
} from "react-icons/fi";
import { useState } from "react";
import TabNavigation from "../../../components/dashboard/TabNav";
import Activities from "../../../components/dashboard/Activities";
import BeautyDashboardLayout from "../components/layout/BeautyDashboardLayout";
import ActivityDetailsModal from "../../../components/dashboard/ActivityDetailsModal";

const SAMPLE_NOTIFICATIONS = [
  {
    _id: "1",
    type: "new_booking_request",
    title: "New booking request",
    message: "You have a new booking request from Ada O. for a plumbing job.",
    createdAt: "2026-09-16T09:30:00Z",
  },
  {
    _id: "2",
    type: "payment_received",
    title: "Payment received",
    message: "You received ₦15,000 for the electrical repair job.",
    createdAt: "2026-09-15T14:10:00Z",
  },
  {
    _id: "3",
    type: "job_completed_confirmed",
    title: "Job marked as completed",
    message: "Your job with Chinedu A. has been confirmed as completed.",
    createdAt: "2026-09-14T11:05:00Z",
  },
  {
    _id: "4",
    type: "new_message",
    title: "New message",
    message: "You have a new message from Blessing E. regarding your booking.",
    createdAt: "2026-09-12T08:45:00Z",
  },
  {
    _id: "5",
    type: "booking_cancelled",
    title: "Booking cancelled",
    message: "The booking with Tunde F. was cancelled.",
    createdAt: "2026-09-10T16:20:00Z",
  },
];

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
    message:
      "Your recent activity will appear here once you start using the platform.",
  },
  Bookings: {
    icon: FiCalendar,
    title: "No booking activity",
    message:
      "Booking updates will show up here when you make or receive bookings.",
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

const TABS = ["All", "Bookings", "Payments", "Updates"];

export default function BeautyActivityPage() {
  const [activeTab, setActiveTab] = useState("All");
  // const [notifications, setNotifications] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const notifications = SAMPLE_NOTIFICATIONS;

  const tabTypes = TAB_TYPE_MAP[activeTab];
  const tabFiltered = tabTypes
    ? notifications.filter((n) => tabTypes.includes(n.type))
    : notifications;
  const emptyState = EMPTY_STATE_CONFIG[activeTab];

  const currentPage = 1;
  const totalPages = 1;

  return (
    <BeautyDashboardLayout>
      <div className="w-full mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="font-bold text-2xl">Activity</h1>
        </div>

        {/* Tabs */}
        <div className="mb-6 mt-6">
          <TabNavigation
            tabs={TABS}
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
              readOnly
              className="w-full pl-11 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent bg-white text-sm"
              aria-label="Search activity"
            />
          </div>
        </div>

        {/* Activity List */}
        <div className="space-y-3">
          {tabFiltered.length > 0 ? (
            tabFiltered.map((notification) => (
              <Activities
                key={notification._id}
                notification={notification}
                onDelete={() => {}}
                onViewDetails={setSelectedNotification}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white px-6 py-12 text-center">
              <emptyState.icon
                className="mb-3 text-gray-400"
                size={32}
                aria-hidden="true"
              />
              <h2 className="font-semibold text-gray-900">
                {emptyState.title}
              </h2>
              <p className="mt-1 max-w-md text-sm text-gray-500">
                {emptyState.message}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {tabFiltered.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 mt-4 bg-white rounded-lg border border-gray-200">
            <button
              disabled
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 hidden sm:inline">
                1–{tabFiltered.length} of {tabFiltered.length}
              </span>
              <div className="flex items-center gap-1">
                {Array.from(
                  { length: Math.min(totalPages, 5) },
                  (_, i) => i + 1,
                ).map((page) => (
                  <button
                    key={page}
                    className={`w-8 h-8 flex items-center justify-center text-sm rounded-lg transition-colors ${
                      currentPage === page
                        ? "bg-[#005823] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    aria-label={`Page ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>

            <button
              disabled
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
      </div>
    </BeautyDashboardLayout>
  );
}
