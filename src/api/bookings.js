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

export const getAllBookings = async () => {
  const token = localStorage.getItem("token");
  const { data } = await api.get("/bookings", {
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

export const getProviderBookings = async () => {
  const token = localStorage.getItem("token");
  const { data } = await api.get("/provider/bookings", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

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

export const getUserBookings = async () => {
  const token = localStorage.getItem("token");
  const { data } = await api.get("/bookings/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};
