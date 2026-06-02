import api from "./axios";
import { trackEvent } from "../services/analytics";

export const initializePayment = async (bookingId, pickupNote) => {
    trackEvent("payment_started", {
        booking_id: bookingId,
        method: "paystack",
    });

    const payload = { bookingId };
    if (pickupNote) payload.pickupNote = pickupNote;
    try {
        const { data } = await api.post("/payment/initialize", payload);
        trackEvent("payment_initialized", {
            booking_id: bookingId,
            method: "paystack",
        });
        return data;
    } catch (error) {
        trackEvent("payment_initialize_failed", {
            booking_id: bookingId,
            method: "paystack",
            status: error?.response?.status,
        });
        throw error;
    }
};

export const verifyPayment = async (reference) => {
    try {
        const { data } = await api.get(`/payment/verify/${reference}`);
        trackEvent("payment_completed", {
            method: "paystack",
            reference_type: reference ? "present" : "missing",
        });
        return data;
    } catch (error) {
        trackEvent("payment_failed", {
            method: "paystack",
            status: error?.response?.status,
        });
        throw error;
    }
};

export const payWithWallet = async (bookingId, pickupNote) => {
    trackEvent("payment_started", {
        booking_id: bookingId,
        method: "wallet",
    });

    const payload = { bookingId };
    if (pickupNote) payload.pickupNote = pickupNote;
    try {
        const { data } = await api.post("/wallet/pay", payload);
        trackEvent("payment_completed", {
            booking_id: bookingId,
            method: "wallet",
        });
        return data;
    } catch (error) {
        trackEvent("payment_failed", {
            booking_id: bookingId,
            method: "wallet",
            status: error?.response?.status,
        });
        throw error;
    }
};

export const getPromoEligibility = async () => {
    const { data } = await api.get("/payment/promo-eligibility");
    return data;
};
