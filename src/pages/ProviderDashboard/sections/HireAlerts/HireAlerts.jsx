import ProviderDashboardLayout from "../../../../components/layouts/ProviderDashboardLayout";
import { useState, useEffect } from "react";
import JobsCard from "../../../../components/provider-dashboard/JobsCard";
import AlertsCard from "../../../../components/provider-dashboard/AlertsCard";
import AlertDetailsModal from "./AlertDetails";
import JobDetailsModal from "./JobDetails";
import MarkAsCompleted from "../../../../components/provider-dashboard/MarkAsCompleted";
import { getProviderBookings } from "../../../../api/provider";
import { getAllBookings } from "../../../../api/bookings";

export default function HireAlerts() {
  const [activeTab, setActiveTab] = useState("alert");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isMarkOpen, setIsMarkOpen] = useState(false);


  const [jobs, setJobs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getProviderBookings();
      const bookingsData = response.data || response;


      if (Array.isArray(bookingsData)) {
        const jobsList = bookingsData.filter(
          (booking) =>
            booking.status === "accepted" ||
            booking.status === "in_progress" ||
            booking.status === "completed" ||
            booking.status === "waiting_confirmation"
        );
        const alertsList = bookingsData.filter(
          (booking) => booking.status === "pending"
        );

        setJobs(jobsList);
        setAlerts(alertsList);
      } else if (bookingsData.bookings) {

        const jobsList = bookingsData.bookings.filter(
          (booking) =>
            booking.status === "accepted" ||
            booking.status === "in_progress" ||
            booking.status === "completed" ||
            booking.status === "waiting_confirmation"
        );
        const alertsList = bookingsData.bookings.filter(
          (booking) => booking.status === "pending"
        );

        setJobs(jobsList);
        setAlerts(alertsList);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  };

  // States for API data
  const [alerts, setAlerts] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllBookings();
      console.log(response);

      if (response.success) {
        const transformedData = transformBookingsData(response.data);
        setAlerts(transformedData.alerts);
        setJobs(transformedData.jobs);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch bookings");
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const transformBookingsData = (bookings) => {
    const alerts = [];
    const jobs = [];

    bookings.forEach((booking) => {
      const commonData = {
        id: booking._id,
        title: booking.title,
        price:
          booking.agreedPrice || booking.calculatedPrice || booking.budget || 0,
        deliveryDate: booking.endDate
          ? new Date(booking.endDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "TBD",
        scheduledDate:
          new Date(booking.startDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }) +
          " - " +
          new Date(booking.startDate).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
        location:
          booking.location?.address || booking.pickupLocation?.address || "N/A",
        // Store original data for modal details
        originalData: booking,
      };

      // Categorize based on status
      if (
        booking.status === "pending_providers" ||
        booking.status === "pending_customer"
      ) {
        // These are alerts (new job opportunities)
        alerts.push({
          ...commonData,
          status:
            booking.status === "pending_providers"
              ? "New"
              : "Awaiting Response",
          distance: booking.distance
            ? `${booking.distance.value} ${booking.distance.unit} away`
            : "N/A",
          posted:
            booking.status === "pending_providers"
              ? getTimeAgo(booking.createdAt)
              : null,
          offerSent:
            booking.status === "pending_customer"
              ? getTimeAgo(booking.updatedAt)
              : null,
        });
      } else {
        // These are active jobs
        jobs.push({
          ...commonData,
          status: mapJobStatus(booking.status),
          providerName: "You", // Since this is provider dashboard
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
        });
      }
    });

    return { alerts, jobs };
  };

  const mapJobStatus = (apiStatus) => {
    const statusMap = {
      confirmed: "Pending",
      in_progress: "In Progress",
      waiting_confirmation: "Waiting confirmation",
      completed: "Completed",
      cancelled: "Cancelled",
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
            className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${activeFilter === filter.toLowerCase()
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
    const status = job.status?.toLowerCase() || "";

    if (statusFilter === "all") return true;

    if (statusFilter === "active") {
      return status === "in_progress" || status === "waiting_confirmation";
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
    setIsMarkOpen(false);
    setSelectedJob(null);
  };


  const handleRefresh = () => {
    fetchBookings();
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
        onRefresh={handleRefresh}
      />

      <JobDetailsModal
        isOpen={isJobModalOpen}
        onClose={handleCloseJob}
        job={selectedJob || {}}
        onRefresh={handleRefresh}
      />

      <MarkAsCompleted
        isOpen={isMarkOpen}
        onClose={handleCloseMark}
        job={selectedJob || {}}
        onRefresh={handleRefresh}
      />


      {isLoading && (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D6A3E] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading bookings...</p>
          </div>
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
      )}


      {error && !isLoading && (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center max-w-md">
            <div className="text-red-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Failed to Load Bookings
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-[#2D6A3E] text-white rounded-lg hover:bg-[#1f4a2a] transition-colors"
            >
              Retry
            </button>
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


      {!isLoading && !error && (
        <>
          <div className="flex border-b mb-3">
            <button
              onClick={() => setActiveTab("alert")}
              className={`px-6 py-3 font-medium transition-colors relative ${activeTab === "alert"
                ? "text-[#005823] border-b-2 border-[#005823]"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              Hire Alerts
            </button>

            <button
              onClick={() => setActiveTab("jobs")}
              className={`px-6 py-3 font-medium transition-colors relative ${activeTab === "jobs"
                ? "text-[#005823] border-b-2 border-[#005823]"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              Jobs
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
                <p className="text-sm text-gray-500">No alerts available</p>
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
                  <p className="text-sm text-gray-500">No jobs found</p>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </ProviderDashboardLayout>
  );
}
