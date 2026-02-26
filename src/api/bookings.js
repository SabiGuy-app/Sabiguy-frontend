import axios from "axios";
import api from "./axios";

export const bookingPost = async (payload) => {
  const token = localStorage.getItem("token");

  const { data } = await api.post("/bookings", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
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
  } = params;

  const queryParams = { status, page, limit };
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
  const { data } = await api.patch(
    `/provider/${bookingId}/accept`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data;
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
  const { data } = await api.get("/user/bookings?page=1&limit=20", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};
export const allowSystem = async (allowSystem) => { 
   const token = localStorage.getItem("token");
   const { data } = await api.put(
    '/bookings/allow-system',
    {
      allowSystem,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return data;

}
export const selectProvider = async (bookingId, providerId) => {
  const token = localStorage.getItem("token");
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
  return data;
};
