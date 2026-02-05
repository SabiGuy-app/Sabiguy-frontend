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
  const { data } = await api.get("/provider/bookings", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};
