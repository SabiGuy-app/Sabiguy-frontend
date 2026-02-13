import api from "./axios";

export const getDashboardStats = async () => {
    const { data } = await api.get("/provider/dashboard/stats");
    return data;
};

export const getProviderBookings = async (status = null) => {
    const params = status ? { status } : {};
    const { data } = await api.get("/provider/bookings", { params });
    return data;
};

export const getBookingDetails = async (bookingId) => {
    const { data } = await api.get(`/provider/bookings/${bookingId}`);
    return data;
};

export const acceptBooking = async (providerId) => {
    const { data } = await api.patch(`/provider/${providerId}/accept`);
    return data;
};

export const startBooking = async (bookingId) => {
    const { data } = await api.patch(`/provider/bookings/${bookingId}/start`);
    return data;
};

export const cancelBooking = async (bookingId, reason = "") => {
    const { data } = await api.patch(`/provider/bookings/${bookingId}/cancel`, {
        reason,
    });
    return data;
};

export const counterOffer = async (bookingId, offerData) => {
    const { data } = await api.patch(
        `/provider/bookings/${bookingId}/counter-offer`,
        offerData
    );
    return data;
};

export const toggleAvailability = async () => {
    const { data } = await api.put("/provider/availability/toggle");
    return data;
};

export const getWalletBalance = async () => {
    const { data } = await api.get("/wallet/balance");
    return data;
};

export const fundWallet = async (amount) => {
    const callbackUrl = `${window.location.origin}/wallet/funding/callback`;
    const { data } = await api.post("/wallet/fund", { amount, callbackUrl });
    return data;
};

export const verifyWalletFunding = async (reference) => {
    const { data } = await api.get(`/wallet/fund/verify/${reference}`);
    return data;
};

export const getWalletTransactions = async (page = 1, limit = 10, type = "") => {
    const params = { page, limit };
    if (type) params.type = type;
    const { data } = await api.get("/wallet/transactions", { params });
    return data;
};

export const payWithWallet = async (bookingId) => {
    const { data } = await api.post("/wallet/pay", { bookingId });
    return data;
};

export const getAllProviders = async () => {
    const { data } = await api.get("/providers");
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
