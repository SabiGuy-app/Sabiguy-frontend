import api from "./axios";
import { trackEvent } from "../services/analytics";

export const getDashboardStats = async () => {
    const { data } = await api.get("/provider/dashboard/stats");
    return data;
};

export const getProviderBookings = async (status = null) => {
    const params = status ? { status } : {};
    const { data } = await api.get("/provider/bookings?limit=40", { params });
    return data;
};

export const getBookingDetails = async (bookingId) => {
    const { data } = await api.get(`/provider/bookings/${bookingId}`);
    return data;
};

export const acceptBooking = async (providerId) => {
    const { data } = await api.patch(`/provider/${providerId}/accept`);
    trackEvent("booking_accepted", { booking_id: providerId });
    return data;
};

export const startBooking = async (bookingId) => {
    const { data } = await api.patch(`/provider/bookings/${bookingId}/start`);
    trackEvent("booking_started", { booking_id: bookingId });
    return data;
};

export const cancelBooking = async (bookingId, reason = "") => {
    const { data } = await api.patch(`/provider/bookings/${bookingId}/cancel`, {
        reason,
    });
    trackEvent("booking_cancelled", { booking_id: bookingId });
    return data;
};

export const counterOffer = async (bookingId, offerData) => {
    const { data } = await api.patch(
        `/provider/bookings/${bookingId}/counter-offer`,
        offerData
    );
    return data;
};

export const toggleAvailability = async (isAvailable) => {
    const { data } = await api.put("/provider/availability/toggle", { isAvailable });
    trackEvent("provider_availability_toggled", { is_available: isAvailable });
    return data;
};

export const getWalletBalance = async (options = {}) => {
    const url = options.bustCache
        ? `/wallet/balance?t=${Date.now()}`
        : "/wallet/balance";
    const { data } = await api.get(url);
    return data;
};

export const fundWallet = async (amount) => {
    const callbackUrl = `${window.location.origin}/wallet/funding/callback`;
    try {
        const { data } = await api.post("/wallet/fund", { amount, callbackUrl });
        trackEvent("wallet_funding_started", { amount: Number(amount) || undefined });
        return data;
    } catch (error) {
        trackEvent("wallet_funding_failed", {
            amount: Number(amount) || undefined,
            status: error?.response?.status,
        });
        throw error;
    }
};

export const verifyWalletFunding = async (reference) => {
    try {
        const { data } = await api.get(`/wallet/fund/verify/${reference}`);
        trackEvent("wallet_funded", {
            reference_type: reference ? "present" : "missing",
        });
        return data;
    } catch (error) {
        trackEvent("wallet_funding_failed", {
            status: error?.response?.status,
        });
        throw error;
    }
};

export const getWalletTransactions = async (page = 1, limit = 10, type = "") => {
    const params = { page, limit };
    if (type) params.type = type;
    const { data } = await api.get("/wallet/transactions", { params });
    return data;
};

export const withdrawFromWallet = async (amount) => {
    // Swagger: POST /api/v1/payment/withdraw-fund
    // Body: { amount } | Response: { success, message, data }
    try {
        const { data } = await api.post("/payment/withdraw-fund", { amount });
        trackEvent("wallet_withdrawal_requested", { amount: Number(amount) || undefined });
        return data;
    } catch (error) {
        trackEvent("wallet_withdrawal_failed", {
            amount: Number(amount) || undefined,
            status: error?.response?.status,
        });
        throw error;
    }
};


export const getProviderProfile = async () => {
    // Correct endpoint based on swagger
    const { data } = await api.get("/provider/profile");
    return data;
};

export const updateProviderProfile = async (profileData) => {
    const { data } = await api.put("/provider/profile", profileData);
    return data;
};

export const updateProviderBankInfo = async (bankData) => {
    const { data } = await api.put("/provider/bank-info", bankData);
    return data;
};

export const updateProviderWorkVisuals = async (visualsData) => {
    const { data } = await api.put("/provider/work-visuals", visualsData);
    return data;
};

export const updateProviderLocation = async (locationData) => {
    const { data } = await api.put("/provider/location", locationData);
    return data;
};

export const updateProviderProfilePic = async (picData) => {
    const { data } = await api.put("/provider/profile-pic", picData);
    return data;
};

export const getAllProviders = async () => {
    const { data } = await api.get("users/providers");
    return data;
};

export const getProviderReviews = async (providerId) => {
    const { data } = await api.get(`/provider/${providerId}/reviews`);
    return data;
};

export const formatBookingStatus = (apiStatus) => {
    const statusMap = {
        pending: "Pending",
        accepted: "Active",
        in_progress: "In Progress",
        completed: "Completed",
        cancelled: "Cancelled",
        waiting_confirmation: "Waiting confirmation",
    };
    return statusMap[apiStatus] || apiStatus;
};

export const formatCurrency = (amount) => {
    if (!amount) return "₦0.00";
    return `₦${Number(amount).toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};
