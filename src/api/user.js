import api from "./axios";
import { trackEvent } from "../services/analytics";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const submitUserNin = async (nin) => {
  try {
    const response = await api.post(
      "/users/nin",
      { ninSlip: nin },
      {
        headers: getAuthHeaders(),
      },
    );
    trackEvent("kyc_submitted", { kyc_type: "buyer_nin" });
    return response;
  } catch (error) {
    trackEvent("kyc_submit_failed", {
      kyc_type: "buyer_nin",
      status: error?.response?.status,
    });
    throw error;
  }
};
