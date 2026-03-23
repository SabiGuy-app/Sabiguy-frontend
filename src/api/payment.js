import api from "./axios";

export const initializePayment = async (bookingId, pickupNote) => {
    const payload = { bookingId };
    if (pickupNote) payload.pickupNote = pickupNote;
    const { data } = await api.post("/payment/initialize", payload);
    return data;
};

export const verifyPayment = async (reference) => {
    const { data } = await api.get(`/payment/verify/${reference}`);
    return data;
};

export const payWithWallet = async (bookingId, pickupNote) => {
    const payload = { bookingId };
    if (pickupNote) payload.pickupNote = pickupNote;
    const { data } = await api.post("/wallet/pay", payload);
    return data;
};
