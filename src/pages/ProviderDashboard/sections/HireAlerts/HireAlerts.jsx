import ProviderDashboardLayout from "../../../../components/layouts/ProviderDashboardLayout";
import { useState, useEffect } from "react";
import JobsCard from "../../../../components/provider-dashboard/JobsCard";
import AlertsCard from "../../../../components/provider-dashboard/AlertsCard";
import AlertDetailsModal from "./AlertDetails";
import JobDetailsModal from "./JobDetails";
import MarkAsCompleted from "../../../../components/provider-dashboard/MarkAsCompleted";
import { getProviderBookings } from "../../../../api/provider";

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
