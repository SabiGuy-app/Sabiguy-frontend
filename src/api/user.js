import api from "./axios";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const submitUserNin = async (nin) => {
  return api.post(
    "/users/nin",
    { ninSlip: nin },
    {
      headers: getAuthHeaders(),
    },
  );
};
