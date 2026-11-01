import { useCallback, useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import NotificationDrawer from "../../../../components/dashboard/Notification";
import NotificationToast from "../../../../components/NotificationToast";
import BookingRequestModal from "../../../../components/BookingRequestModal";
import ActivityDetailsModal from "../../../../components/dashboard/ActivityDetailsModal";
import KycVerificationModal from "../../../../components/provider-dashboard/KycVerificationModal";
import useNotificationCenter from "../../../../hooks/useNotificationCenter";
import { useAuthStore } from "../../../../stores/auth.store";
import { businessLocationService } from "../../../../services/locationService";
import notificationSoundService from "../../../../services/notificationSoundService";
import { getSharedSocket, releaseSocket } from "../../../../services/socketManager";
import { getBusinessByEmail, setBusinessAvailability } from "../../api/businessess";
import { businessDashboardPath } from "../layout/businessNavLinks";
import { BusinessSessionContext } from "./businessSessionContext";

const BOOKING_REQUEST_TYPES = ["new_booking_request", "booking_selected"];

const LOCATION_ERRORS = {
  1: "Location permission denied. Please enable location access in your browser settings.",
  2: "Location unavailable. Please check your device settings.",
  3: "Location request timed out. Please try again.",
};

const playNotificationSound = () => {
  notificationSoundService.play().catch((error) => {
    console.warn("Sound playback failed:", error);
  });
};

const requestCurrentPosition = () =>
  new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true });
  });

// Parent route for the business dashboard. It outlives page navigation, so the
// socket, location heartbeat and notifications don't restart on every page.
export default function BusinessSession() {
  const navigate = useNavigate();
  const email = useAuthStore((state) => state.user?.data?.email);
  const [business, setBusiness] = useState(null);
  const [available, setAvailable] = useState(false);
  const [updatingAvailability, setUpdatingAvailability] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [socket, setSocket] = useState(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);
  const [bookingRequest, setBookingRequest] = useState(null);
  const [completedNotification, setCompletedNotification] = useState(null);

  useEffect(() => {
    const sharedSocket = getSharedSocket();
    if (!sharedSocket) return undefined;
    setSocket(sharedSocket);
    return () => {
      businessLocationService.stopTracking();
      releaseSocket();
    };
  }, []);

  // Also brings fresh staffsOnDuty; pages call it when they need current data.
  const refreshBusiness = useCallback(async () => {
    if (!email) return null;
    try {
      const data = await getBusinessByEmail(email);
      setBusiness(data);
      setAvailable(Boolean(data?.availability?.isAvailable));
      return data;
    } catch (error) {
      console.error("Could not load business profile:", error);
      return null;
    }
  }, [email]);

  useEffect(() => {
    refreshBusiness();
  }, [refreshBusiness]);

  const startLocationTracking = useCallback(async () => {
    if (!navigator.geolocation) {
      toast.error("Your browser does not support location tracking");
      return false;
    }
    try {
      await requestCurrentPosition();
      // Sends over the socket when connected, plus an HTTP heartbeat every 30s.
      businessLocationService.startTracking(socket);
      setLocationEnabled(true);
      return true;
    } catch (error) {
      toast.error(LOCATION_ERRORS[error.code] || "Failed to enable location tracking");
      return false;
    }
  }, [socket]);

  const stopLocationTracking = useCallback(() => {
    businessLocationService.stopTracking();
    setLocationEnabled(false);
  }, []);

  // Search only lists businesses with a recent heartbeat, so track while available.
  useEffect(() => {
    if (available) startLocationTracking();
    else stopLocationTracking();
  }, [available, startLocationTracking, stopLocationTracking]);

  const toggleAvailability = useCallback(async () => {
    if (updatingAvailability) return;
    const next = !available;
    if (next && !(await startLocationTracking())) return;

    setUpdatingAvailability(true);
    try {
      const result = await setBusinessAvailability(next);
      setAvailable(next);
      setBusiness((current) => current && {
        ...current,
        availability: { ...current.availability, isAvailable: next },
      });
      if (next && result?.eligibleForBookings === false) {
        toast(
          `You're available, but customers can't book you until at least ${result.minimumOnDutyStaff} staff are on duty (${result.onDutyStaffCount} now).`,
          { duration: 6000 },
        );
      }
    } catch (error) {
      if (next) stopLocationTracking();
      const message = error?.response?.data?.message || "";
      if (error?.response?.status === 403 || /kyc/i.test(message)) {
        setShowKycModal(true);
      } else {
        toast.error(message || "Couldn't update availability. Please try again.");
      }
    } finally {
      setUpdatingAvailability(false);
    }
  }, [available, startLocationTracking, stopLocationTracking, updatingAvailability]);

  const viewBookingRequest = useCallback((notification) => {
    setBookingRequest(null);
    setNotificationsOpen(false);
    // The bookings page opens ?booking=<id> once its list has loaded.
    const bookingId = notification?.data?.bookingId ?? notification?.bookingId;
    const params = new URLSearchParams({ tab: "requests" });
    if (bookingId) params.set("booking", bookingId);
    navigate(`${businessDashboardPath}/bookings?${params}`);
  }, [navigate]);

  const notificationCenter = useNotificationCenter(socket, (notification) => {
    playNotificationSound();
    if (["staff_clock_in_requested", "staff_clock_out_requested"].includes(notification?.type)) {
      window.dispatchEvent(new CustomEvent("business:staff-clock-request", { detail: notification }));
    }
    if (BOOKING_REQUEST_TYPES.includes(notification?.type)) {
      window.dispatchEvent(new CustomEvent("business:booking-request", { detail: notification }));
      setBookingRequest(notification);
      return;
    }
    if (notification?.type === "job_completed_confirmed") {
      setCompletedNotification(notification);
      return;
    }
    toast.custom(
      (t) => (
        <NotificationToast
          notification={notification}
          onClose={() => toast.dismiss(t.id)}
          onClick={() => {
            toast.dismiss(t.id);
            setNotificationsOpen(true);
          }}
        />
      ),
      { duration: 5000, position: "top-right" },
    );
  });
  const { fetchNotifications, unreadCount } = notificationCenter;

  const openNotifications = useCallback(() => {
    setNotificationsOpen(true);
    fetchNotifications();
  }, [fetchNotifications]);

  const value = useMemo(() => ({
    business,
    refreshBusiness,
    available,
    updatingAvailability,
    locationEnabled,
    toggleAvailability,
    unreadCount,
    openNotifications,
  }), [business, refreshBusiness, available, updatingAvailability, locationEnabled, toggleAvailability, unreadCount, openNotifications]);

  return (
    <BusinessSessionContext.Provider value={value}>
      <Outlet />
      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notificationCenter.notifications}
        loading={notificationCenter.loading}
        unreadCount={unreadCount}
        onMarkAsRead={notificationCenter.markAsRead}
        onMarkAllAsRead={notificationCenter.markAllAsRead}
        onDelete={notificationCenter.deleteNotification}
        onBookingRequestClick={viewBookingRequest}
        showSampleNotifications={false}
      />
      <KycVerificationModal isOpen={showKycModal} onClose={() => setShowKycModal(false)} />
      <BookingRequestModal
        isOpen={Boolean(bookingRequest)}
        onClose={() => setBookingRequest(null)}
        onViewBooking={() => viewBookingRequest(bookingRequest)}
        notification={bookingRequest}
      />
      <ActivityDetailsModal
        isOpen={Boolean(completedNotification)}
        onClose={() => setCompletedNotification(null)}
        notification={completedNotification}
      />
      <Toaster position="top-right" />
    </BusinessSessionContext.Provider>
  );
}
