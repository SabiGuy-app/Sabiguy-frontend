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
