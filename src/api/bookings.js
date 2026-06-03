import api from "./axios";
import { useAuthStore } from "../stores/auth.store";
import { getBuyerBookingGate } from "../utils/buyerKycStatus";
import { trackEvent } from "../services/analytics";

export const bookingPost = async (payload) => {
  const token = localStorage.getItem("token");
  const bookingGate = getBuyerBookingGate(useAuthStore.getState().user);

  if (!bookingGate.canCreateBooking) {
    trackEvent("booking_kyc_gate_shown", {
      kyc_status: bookingGate.status,
    });
    const error = new Error(bookingGate.message);
    error.code = "BUYER_KYC_REQUIRED";
    error.kycGate = bookingGate;
    throw error;
  }

  try {
    const { data } = await api.post("/bookings", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    trackEvent("booking_created", {
      booking_id: data?.data?._id || data?.booking?._id || data?._id,
      service_type: payload?.serviceType,
      sub_category: payload?.subCategory,
      mode_of_delivery: payload?.modeOfDelivery,
      schedule_type: payload?.scheduleType,
      allow_system: payload?.allowSystem,
    });

    return data;
  } catch (error) {
    trackEvent("booking_create_failed", {
      service_type: payload?.serviceType,
      sub_category: payload?.subCategory,
      status: error?.response?.status,
    });
    throw error;
  }
};

export const getAllBookings = async (params = {}) => {
  const token = localStorage.getItem("token");
  const {
    status = "awaiting_provider_acceptance",
    serviceType,
    subCategory,
    modeOfDelivery,
    page = 1,
    limit = 10,
    startDate = 'Today',
    timeWindow = '10m',
    maxDistanceKm =30
  } = params;

  const queryParams = { status, page, limit, startDate, timeWindow, maxDistanceKm };
  if (serviceType) queryParams.serviceType = serviceType;
  if (subCategory) queryParams.subCategory = subCategory;
  if (modeOfDelivery) queryParams.modeOfDelivery = modeOfDelivery;

  const { data } = await api.get("/bookings", {
    params: queryParams,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

export const getBookingsDetails = async (payload) => {
  const token = localStorage.getItem("token");
  const { data } = await api.get(`/bookings/${payload}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

export const acceptBookings = async (bookingId) => {
  const token = localStorage.getItem("token");
  try {
    const { data } = await api.patch(
      `/provider/${bookingId}/accept`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    trackEvent("booking_accepted", { booking_id: bookingId });
    return data;
  } catch (error) {
    trackEvent("booking_accept_failed", {
      booking_id: bookingId,
      status: error?.response?.status,
    });
    throw error;
  }
};

export const startJob = async (bookingId) => {
  const token = localStorage.getItem("token");
  const { data } = await api.patch(
    `/provider/bookings/${bookingId}/start`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  trackEvent("booking_started", { booking_id: bookingId });
  return data;
};

export const updateBookingStatus = async (bookingId, status) => {
  const token = localStorage.getItem("token");
  const { data } = await api.patch(
    `/provider/bookings/${bookingId}/status`,
    {},
    {
      params: { status },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  trackEvent("booking_status_updated", {
    booking_id: bookingId,
    booking_status: status,
  });
  return data;
};

export const markAsComplete = async (bookingId) => {
  const token = localStorage.getItem("token");
  const { data } = await api.patch(
    `/provider/bookings/${bookingId}/complete`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  trackEvent("booking_completed", { booking_id: bookingId });
  return data;
};

export const getProviderBookings = async () => {
  const token = localStorage.getItem("token");
  const { data } = await api.get("/provider/bookings?page=1&limit=20", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

export const getUserBookings = async () => {
  const token = localStorage.getItem("token");
  const { data } = await api.get("/bookings/user?page=1&limit=20", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

export const allowSystem = async (allowSystem) => {
  const token = localStorage.getItem("token");
  const { data } = await api.put(
    "/bookings/allow-system",
    {
      allowSystem,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  trackEvent("booking_auto_match_toggled", { allow_system: allowSystem });
  return data;
};
export const selectProvider = async (bookingId, providerId) => {
  const token = localStorage.getItem("token");
  try {
    const { data } = await api.put(
      `/bookings/${bookingId}/select-provider`,
      {
        providerId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    trackEvent("provider_selected", {
      booking_id: bookingId,
      provider_id: providerId,
    });
    return data;
  } catch (error) {
    trackEvent("provider_select_failed", {
      booking_id: bookingId,
      provider_id: providerId,
      status: error?.response?.status,
    });
    throw error;
  }
};

export const acceptCompletion = async (bookingId, payload) => {
  const { data } = await api.patch(
    `/bookings/${bookingId}/accept-completion`,
    payload,
  );
  trackEvent("booking_completion_accepted", { booking_id: bookingId });
  return data;
};

export const disputeCompletion = async (bookingId, payload) => {
  const endpoints = [
    `/bookings/${bookingId}/dispute`,
  ];

  let lastError;

  for (const endpoint of endpoints) {
    try {
      const { data } = await api.patch(endpoint, payload);
      trackEvent("booking_completion_disputed", { booking_id: bookingId });
      return data;
    } catch (error) {
      lastError = error;
      const status = error?.response?.status;
      if (status !== 404 && status !== 405) {
        throw error;
      }
    }
  }

  throw lastError;
};

export const cancelBooking = async (bookingId, reason) => {
  const { data } = await api.patch(`/bookings/${bookingId}/cancel`, { reason });
  trackEvent("booking_cancelled", { booking_id: bookingId });
  return data;
};
