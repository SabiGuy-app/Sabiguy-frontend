import ProviderDashboardLayout from "../../../../components/layouts/ProviderDashboardLayout";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Add this
import JobsCard from "../../../../components/provider-dashboard/JobsCard";
import AlertsCard from "../../../../components/provider-dashboard/AlertsCard";
import AlertDetailsModal from "./AlertDetails";
import JobDetailsModal from "./JobDetails";
import MarkAsCompleted from "../../../../components/provider-dashboard/MarkAsCompleted";
import { getAllBookings, getProviderBookings } from "../../../../api/bookings";

export default function HireAlerts() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("alert");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isMarkOpen, setIsMarkOpen] = useState(false);

  // States for API data
  const [alerts, setAlerts] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, [activeTab]); // Refetch when tab changes

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      if (activeTab === "alert") {
        // Fetch available bookings for Hire Alerts
        const response = await getAllBookings();
        console.log("🔔 Available Bookings:", response);

        if (response.success && response.data.length > 0) {
          const transformedAlerts = transformAvailableBookings(response.data);
          setAlerts(transformedAlerts);
        } else {
          setAlerts([]);
        }
      } else {
        // Fetch provider's accepted bookings for Jobs tab
        const response = await getProviderBookings();
        console.log("📦 Provider Bookings:", response);

        if (response.success && response.data.length > 0) {
          const transformedJobs = transformProviderBookings(response.data);
          setJobs(transformedJobs);
        } else {
          setJobs([]);
        }
      }
    } catch (err) {
      setError(err.message || "Failed to fetch bookings");
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const transformAvailableBookings = (bookings) => {
    // Filter only pending_providers status
    const availableBookings = bookings.filter(
      (booking) => booking.status === "awaiting_provider_acceptance"
    );

    return availableBookings.map((booking) => ({
      id: booking._id,
      title: booking.title,
      fullName: booking.userId.fullName,
      number: booking.userId.phoneNumber,
      status: "New",
      distance: booking.distance
        ? `${booking.distance.value} ${booking.distance.unit} away`
        : "N/A",
      price: booking.calculatedPrice || booking.budget || 0,
      scheduleType: booking.scheduleType,
      posted: getTimeAgo(booking.createdAt),
      location:
        booking.location?.address || booking.pickupLocation?.address || "N/A",
      originalData: booking,
    }));
  };

  const transformProviderBookings = (bookings) => {
    return bookings.map((booking) => ({
      id: booking._id,
      title: booking.title,
      price:
        booking.agreedPrice || booking.calculatedPrice || booking.budget || 0,
      location:
        booking.location?.address || booking.pickupLocation?.address || "N/A",
      status: mapJobStatus(booking.status),
      providerName: "You",
      startsIn:
        booking.status === "confirmed"
          ? calculateTimeUntil(booking.startDate)
          : null,
      est_completion:
        booking.status === "in_progress"
          ? calculateEstCompletion(booking.startDate, booking.endDate)
          : null,
      completed:
        booking.status === "completed" ||
        booking.status === "waiting_confirmation"
          ? getTimeAgo(booking.updatedAt)
          : null,
      ratings: booking.rating || null,
      originalData: booking,
    }));
  };

  const mapJobStatus = (apiStatus) => {
    const statusMap = {
      confirmed: "Pending",
      in_progress: "In Progress",
      waiting_confirmation: "Waiting confirmation",
      completed: "Completed",
      cancelled: "Cancelled",
      pending_customer: "Awaiting Response",
    };
    return statusMap[apiStatus] || apiStatus;
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMins < 1) return "just now";
    if (diffInMins < 60) return `${diffInMins} min ago`;
    if (diffInHours < 24) return `${diffInHours} hr ago`;
    return `${diffInDays} days ago`;
  };

  const calculateTimeUntil = (startDate) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffInMs = start - now;

    if (diffInMs <= 0) return "Starting now";

    const diffInMins = Math.floor(diffInMs / 60000);
    const hours = Math.floor(diffInMins / 60);
    const minutes = diffInMins % 60;
    const seconds = Math.floor((diffInMs % 60000) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const calculateEstCompletion = (startDate, endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffInMs = end - now;

    if (diffInMs <= 0) return "Completed";

    const diffInHours = Math.floor(diffInMs / 3600000);

    if (diffInHours < 1) return `${Math.floor(diffInMs / 60000)} mins`;
    if (diffInHours < 24) return `${diffInHours} hours`;
    return `${Math.floor(diffInHours / 24)} days`;
  };

  const StatusFilter = ({ activeFilter, onFilterChange }) => {
    const filters = ["All", "Active", "Pending", "Completed"];

    return (
      <div className="flex gap-3 mb-6">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter.toLowerCase())}
            className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
              activeFilter === filter.toLowerCase()
                ? "bg-[#2D6A3E] text-white"
                : "bg-white text-gray-600 border border-gray-300 hover:border-[#2D6A3E] hover:text-[#2D6A3E]"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    );
  };

  const filteredJobs = jobs.filter((job) => {
    const status = job.status.toLowerCase();

    if (statusFilter === "all") return true;

    if (statusFilter === "active") {
      return status === "in progress" || status === "waiting confirmation";
    }

    return status === statusFilter;
  });

  const handleViewAlert = (alert) => {
    setSelectedAlert(alert);
    setIsAlertModalOpen(true);
  };

  const handleCloseAlert = () => {
    setIsAlertModalOpen(false);
    setSelectedAlert(null);
  };

  const handleViewJob = (job) => {
    setSelectedJob(job);
    setIsJobModalOpen(true);
  };

  const handleCloseJob = () => {
    setIsJobModalOpen(false);
    setSelectedJob(null);
  };

  const handleMark = (job) => {
    setSelectedJob(job);
    setIsMarkOpen(true);
  };

  const handleCloseMark = () => {
    setSelectedJob(false);
    setIsMarkOpen(null);
  };

  const handleAcceptSuccess = async () => {
  // Switch to Jobs tab
  setActiveTab("jobs");
  
  // Refresh both tabs
  await fetchBookings(currentPage);
  
  // Show success notification
  console.log("✅ Job accepted! Switched to Jobs tab");
};

  // Loading State
  if (loading) {
    return (
      <ProviderDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D6A3E] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading bookings...</p>
          </div>
        </div>
      </ProviderDashboardLayout>
    );
  }

  // Error State
  if (error) {
    return (
      <ProviderDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchBookings}
              className="px-4 py-2 bg-[#2D6A3E] text-white rounded-lg hover:bg-[#1f4a2a]"
            >
              Retry
            </button>
          </div>
        </div>
      </ProviderDashboardLayout>
    );
  }

  return (
    <ProviderDashboardLayout>
      <AlertDetailsModal
        isOpen={isAlertModalOpen}
        onClose={handleCloseAlert}
        alert={selectedAlert || {}}
        onAcceptSuccess={handleAcceptSuccess}
      />
      
      <JobDetailsModal
        isOpen={isJobModalOpen}
        onClose={handleCloseJob}
        job={selectedJob || {}}
      />

      <MarkAsCompleted
        isOpen={isMarkOpen}
        onClose={handleCloseMark}
        job={selectedJob || {}}
      />

      <div className="flex border-b mb-3">
        <button
          onClick={() => setActiveTab("alert")}
          className={`px-6 py-3 font-medium transition-colors relative ${
            activeTab === "alert"
              ? "text-[#005823] border-b-2 border-[#005823]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Hire Alerts
          {alerts.length > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
              {alerts.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("jobs")}
          className={`px-6 py-3 font-medium transition-colors relative ${
            activeTab === "jobs"
              ? "text-[#005823] border-b-2 border-[#005823]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Jobs
          {jobs.length > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-blue-500 text-white rounded-full">
              {jobs.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === "alert" ? (
        <div className="space-y-4 mt-3">
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <AlertsCard
                key={alert.id}
                alert={alert}
                onViewDetails={handleViewAlert}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500 text-lg">No new alerts available</p>
              <p className="text-gray-400 text-sm mt-2">
                New job opportunities will appear here
              </p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <StatusFilter
            activeFilter={statusFilter}
            onFilterChange={setStatusFilter}
          />

          <div className="space-y-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <JobsCard
                  key={job.id}
                  job={job}
                  onViewDetails={handleViewJob}
                  onMarkAsCompleted={handleMark}
                />
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500 text-lg">No jobs found</p>
                <p className="text-gray-400 text-sm mt-2">
                  Jobs matching your filter will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </ProviderDashboardLayout>
  );
}