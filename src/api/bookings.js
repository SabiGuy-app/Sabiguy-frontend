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

// export const getAllBookings = async () => {
//   const queenToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NzhmNDU0MmM2YzJmZGU3N2ViNjNkOSIsInJvbGUiOiJwcm92aWRlciIsImVtYWlsIjoidGhlcXVlZW5zYW11ZWxAZ21haWwuY29tIiwiaWF0IjoxNzcwMzAyNTAyLCJleHAiOjE3NzAzNzQ1MDJ9.wdWn2snrZe1z0OQNsr2tlyhurHNyCPu5OhiWvv0hheA"
  
//   const { data } = await api.get("/bookings", {
//     headers: {
//       Authorization: `Bearer ${queenToken}`,
//     },
//   });

//   return data.data;
// };

// https://sabiguy-backend.onrender.com/api/v1/provider/bookings?page=1&limit=10