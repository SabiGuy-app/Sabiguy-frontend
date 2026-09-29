import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { FiSearch } from "react-icons/fi";
import { useState } from "react";
import TabNavigation from "../../../components/dashboard/TabNav";
import Activities from "../../../components/dashboard/Activities";
import BeautyDashboardLayout from "../layout/BeautyDashboardLayout";
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

const TABS = ["All", "Bookings", "Payments", "Updates"];

export default function BeautyActivityPage() {
  const [selectedNotification, setSelectedNotification] = useState(null);

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
          <TabNavigation tabs={TABS} activeTab="All" onTabChange={() => {}} />
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
          {SAMPLE_NOTIFICATIONS.map((notification) => (
            <Activities
              key={notification._id}
              notification={notification}
              onDelete={() => {}}
              onViewDetails={setSelectedNotification}
            />
          ))}
        </div>

        {/* Pagination */}
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
              1–{SAMPLE_NOTIFICATIONS.length} of {SAMPLE_NOTIFICATIONS.length}
            </span>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(
                (page) => (
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
                )
              )}
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