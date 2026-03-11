import DashboardLayout from "../../../components/layouts/DashboardLayout";
import ActivityCard from "../../../components/dashboard/ActivityCard";
import { Wallet, Clock, CheckCircle } from "lucide-react";
import { FiSearch } from "react-icons/fi";
import { useState } from "react";
import TabNavigation from "../../../components/dashboard/TabNav";
import Activities from "../../../components/dashboard/Activities";
import ServiceDetailsModal from "./ServiceDetailsModal";

export default function ActivityPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [isServiceDetailsModalOpen, setIsServiceDetailsModalOpen] =
    useState(false);

  const tabs = ["All", "Bookings", "Payments", "Updates"];

  const handleViewDetails = (request) => {
    // setSelectedRequest(request);
    setIsServiceDetailsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsServiceDetailsModalOpen(false);
    // setSelectedRequest(null);
  };

  const activities = [
    {
      id: 1,
      type: "confirmed",
      title: "Booking Confirmed",
      description:
        "Your Booking with Phil Crook (Electrical Installation) has been confirmed.",
      timestamp: "2 hours ago",
      action: {
        label: "View Details",
        // onClick:handleViewDetails
      },
    },
    {
      id: 2,
      type: "onway",
      title: "Provider on the way",
      description: "Phil Crook is on his way to your location.",
      timestamp: "2 hours ago",
      action: {
        label: "Track Provider",
        onClick: () => console.log("Track provider clicked"),
      },
    },
    {
      id: 3,
      type: "arrived",
      title: "Provider Arrived",
      description: "Phil Crook has arrived at your location.",
      timestamp: "2 hours ago",
      action: {
        label: "Contact Provider",
        onClick: () => console.log("Contact provider clicked"),
      },
    },
    {
      id: 4,
      type: "started",
      title: "Project Started",
      description: "Your electrician has started working on your project.",
      timestamp: "2 hours ago",
      action: {
        label: "Contact Provider",
        onClick: () => console.log("Contact provider clicked"),
      },
    },
    {
      id: 5,
      type: "completed",
      title: "Service Completed",
      description:
        "Your Electrical Installation project has been completed and reviewed.",
      timestamp: "2 hours ago",
      action: {
        label: "View Details",
        onClick: () => console.log("View details clicked"),
      },
    },
    {
      id: 6,
      type: "cancelled",
      title: "Project cancelled",
      description:
        'Your cancellation request for "Ceiling fan Installation" has been granted.',
      timestamp: "2 days ago",
      action: {
        label: "View Details",
        onClick: () => console.log("View details clicked"),
      },
    },
    {
      id: 7,
      type: "pending",
      title: "Pending Review",
      description:
        "Phil Crook marked job as completed. Rate and review to Complete this project.",
      timestamp: "3 days ago",
      action: {
        label: "Review",
        onClick: () => console.log("Review clicked"),
      },
    },
    {
      id: 8,
      type: "declined",
      title: "Cancellation Declined",
      description:
        "Phil Crook declined your cancellation request for Full house wiring.",
      timestamp: "3 days ago",
      action: {
        label: "Contact Support",
        onClick: () => console.log("Contact support clicked"),
      },
    },
  ];

  return (
    <DashboardLayout>
      <div className="w-full mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <ServiceDetailsModal
          isOpen={isServiceDetailsModalOpen}
          onClose={handleCloseModal}
          // request={selectedRequest || {}}
        />
        <h1 className="font-bold text-2xl">Activity</h1>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <ActivityCard
          title="Active orders"
          value="₦0.00"
          figure="3"
          icon={<Clock size={20} className="text-yellow-500" />}
        />

        <ActivityCard
          title="Completed tasks"
          figure="2"
          value="Active Requests"
          icon={<CheckCircle size={20} className="text-green-400" />}
        />

        <ActivityCard
          title="Payments"
          figure="2"
          value="New Messages"
          icon={<Wallet size={20} className="text-red-600" />}
        />
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
            className="w-full pl-11 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent bg-white text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-3">
        {activities.map((activity) => (
          <Activities key={activity.id} activity={activity} />
        ))}
      </div>
      </div> {/* end container max-w-xl */}
    </DashboardLayout>
  );
}
