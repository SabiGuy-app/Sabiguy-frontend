import api from "../../../api/axios";

export const getBusinessByEmail = async (email) => {
  const { data } = await api.get("/businesses/by-email", {
    params: { email },
  });
  return data?.data || data;
};

export const updateServiceDetails = async (payload) => {
  const { data } = await api.post("/businesses/service-details", payload);
  return data?.data || data;
};

export const getBanks = async () => {
  const { data } = await api.get("/payment/banks");
  return data?.data || data;
};

export const verifyBankAccount = async ({ accountNumber, bankCode }) => {
  const { data } = await api.post("/payment/verify-bank", {
    accountNumber,
    bankCode,
  });
  return data?.data || data;
};