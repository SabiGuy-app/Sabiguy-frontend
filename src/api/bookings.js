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

// export const getBookings = async () => {
//   const token = localStorage.getItem("token");
//   const { data } = await api.get("/provider/bookings?status=completed&page=1&limit=10", {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   return data;
// };
