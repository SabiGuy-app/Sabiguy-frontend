import api from "./axios";

export const initializePayment = async (bookingId) => {
    // Correct endpoint from swagger
    const { data } = await api.post("/payment/initialize", { bookingId });
    return data;
};

export const verifyPayment = async (reference) => {
    // Correct endpoint from swagger
    const { data } = await api.get(`/payment/verify/${reference}`);
    return data;
};

export const payWithWallet = async (bookingId) => {
    const { data } = await api.post("/wallet/pay", { bookingId });
    return data;
};
