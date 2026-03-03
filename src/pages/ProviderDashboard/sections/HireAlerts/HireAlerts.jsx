import ProviderDashboardLayout from "../../../../components/layouts/ProviderDashboardLayout";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JobsCard from "../../../../components/provider-dashboard/JobsCard";
import AlertsCard from "../../../../components/provider-dashboard/AlertsCard";
import AlertDetailsModal from "./AlertDetails";
import JobDetailsModal from "./JobDetails";
import MarkAsCompleted from "../../../../components/provider-dashboard/MarkAsCompleted";
import { getProviderBookings } from "../../../../api/provider";
import { getAllBookings, acceptBookings} from "../../../../api/bookings";
import { useAuthStore } from "../../../../stores/auth.store";


export default function HireAlerts() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("alert");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isMarkOpen, setIsMarkOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const [jobs, setJobs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [acceptingAlertId, setAcceptingAlertId] = useState(null);



  useEffect(() => {
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const providerJobsPromise = getProviderBookings();
      const rawUserJobs = user?.job || user?.data?.job || [];
      const userJobs = Array.isArray(rawUserJobs)
        ? rawUserJobs
        : [rawUserJobs];
      const resolveModeOfDelivery = (job) => {
        const normalizedTitle = String(job?.title || "")
          .trim()
          .toLowerCase();
        if (normalizedTitle === "car_driver") return "Car";
        if (normalizedTitle === "motorbike_rider") return "bike";
        return "";
      };

      const alertRequests = userJobs
        .filter((job) => job?.service && job?.title)
        .map((job) => {
          const modeOfDelivery = resolveModeOfDelivery(job);
          return (
        getAllBookings({
          status: "awaiting_provider_acceptance",
          serviceType: String(job.service).trim().toLowerCase(),
          modeOfDelivery,
          page: 1,
          limit: 20,
        })
          );
        });

      const [providerResponse, ...alertResponses] = await Promise.all([
        providerJobsPromise,
        ...alertRequests,
      ]);

      const providerBookingsData = providerResponse.data || providerResponse;
      const providerBookings = Array.isArray(providerBookingsData)
        ? providerBookingsData
        : providerBookingsData.bookings || [];
      const transformedJobs = transformBookingsData(providerBookings).jobs;
      setJobs(transformedJobs);

      const alertBookings = alertResponses.flatMap((response) => {
        const data = response.data || response;
        if (Array.isArray(data)) return data;
        if (Array.isArray(data.bookings)) return data.bookings;
        return [];
      });

      const uniqueAlertBookings = Array.from(
        new Map(alertBookings.map((booking) => [booking._id, booking])).values()
      );
      const transformedAlerts = transformBookingsData(uniqueAlertBookings).alerts;
      setAlerts(transformedAlerts);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  };


  const transformBookingsData = (bookings) => {
    const alerts = [];
    const jobs = [];

    bookings.forEach((booking) => {
      const bookingStatus = String(booking.status || "").trim().toLowerCase();
      const formattedSubCategory = booking.subCategory
        ? String(booking.subCategory).replace(/_/g, " ")
        : "";
      const commonData = {
        id: booking._id,
        title: booking.title || formattedSubCategory || booking.serviceType || "Untitled job",
        price:
          booking.agreedPrice || booking.calculatedPrice || booking.budget || 0,
        calculatedPrice: booking.calculatedPrice || booking.agreedPrice || booking.budget || 0,
        agreedPrice: booking.agreedPrice || booking.calculatedPrice || booking.budget || 0,
        deliveryDate: booking.endDate
          ? new Date(booking.endDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
          : booking.scheduleType
            ? String(booking.scheduleType).replace(/_/g, " ")
            : "TBD",
        scheduledDate:
          booking.startDate
            ? new Date(booking.startDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }) +
            " - " +
            new Date(booking.startDate).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })
            : booking.scheduleType
              ? String(booking.scheduleType).replace(/_/g, " ")
              : "TBD",
        location:
          booking.location?.address || booking.pickupLocation?.address || "N/A",
        pickupLocation: booking.pickupLocation || null,
        dropoffLocation: booking.dropoffLocation || null,
        scheduleType: booking.scheduleType || "N/A",
        createdAt: booking.createdAt || null,
        modeOfDelivery: booking.modeOfDelivery || "",
        distance: booking.distance || null,
        // Store original data for modal details
        originalData: booking,
      };

      // Categorize based on status
      if (
        bookingStatus === "pending_providers" ||
        bookingStatus === "pending_customer" ||
        bookingStatus === "awaiting_provider_acceptance"
      ) {
        // These are alerts (new job opportunities)
        alerts.push({
          ...commonData,
          subCategory: formattedSubCategory || commonData.title,
          scheduleType: booking.scheduleType || "TBD",
          modeOfDelivery: booking.modeOfDelivery || "",
          status:
            bookingStatus === "pending_customer"
              ? "Awaiting Response"
              : "New",
          distance: booking.distance
            ? `${booking.distance.value} ${booking.distance.unit} away`
            : "N/A",
          posted:
            bookingStatus === "pending_providers" ||
            bookingStatus === "awaiting_provider_acceptance"
              ? getTimeAgo(booking.createdAt || booking.updatedAt)
              : null,
          offerSent:
            bookingStatus === "pending_customer"
              ? getTimeAgo(booking.updatedAt)
              : null,
        });
      } else {
        // These are active jobs
        jobs.push({
          ...commonData,
          status: mapJobStatus(bookingStatus),
          providerName: "You", // Since this is provider dashboard
          startsIn:
            bookingStatus === "confirmed"
              ? calculateTimeUntil(booking.startDate)
              : null,
          est_completion:
            bookingStatus === "in_progress"
              ? calculateEstCompletion(booking.startDate, booking.endDate)
              : null,
          completed:
            bookingStatus === "completed" ||
              bookingStatus === "waiting_confirmation"
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
      provider_selected: "Awaiting Job Commencement",
      in_progress: "In Progress",
      waiting_confirmation: "Waiting confirmation",
      completed: "Awaiting Confirmation",
      cancelled: "Cancelled",
      pending_customer: "Awaiting Response",
      user_accepted_completion: "Job Confirmed",
      funds_released: "Funds Released",
      paid_escrow: 'Paid Escrow',
      payment_pending: 'Payment Pending'

    };
    const normalizedStatus = String(apiStatus || "").trim().toLowerCase();
    return statusMap[normalizedStatus] || apiStatus;
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
    const status = (job.status || "").toLowerCase().replace(/_/g, " ");

    if (statusFilter === "all") return true;

    if (statusFilter === "active") {
      return (
        status === "completed" ||
        status === "in progress" ||
        status === "paid escrow" ||
        status === "waiting confirmation" ||
        status === "awaiting confirmation" ||
        status === "job confirmed"
      );
    }

     if (statusFilter === "pending") {
      return (
        status === "awaiting job commencement"
      );
    }

     if (statusFilter === "completed") {
      return (
       
        status === "funds released" ||
        status === "job confirmed"
      );
    }

    return status === statusFilter.replace(/_/g, " ");
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

  const handleAcceptBooking = async (alert) => {
    if (!alert?.id) return;
    try {
      setAcceptingAlertId(alert.id);
      await acceptBookings(alert.id);
      navigate("/dashboard/provider/start-navigation", {
        state: { alert },
      });
    } catch (err) {
      console.error("Error accepting booking:", err);
      setError(err.response?.data?.message || "Failed to accept booking");
    } finally {
      setAcceptingAlertId(null);
    }
  };


  // Loading State
  if (isLoading) {
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

      <div className="flex border-b mb-3">
        <button
          onClick={() => setActiveTab("alert")}
          className={`px-6 py-3 font-medium transition-colors relative ${activeTab === "alert"
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
          className={`px-6 py-3 font-medium transition-colors relative ${activeTab === "jobs"
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
                onAcceptBooking={handleAcceptBooking}
                accepting={acceptingAlertId === alert.id}
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
