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

// Also reports onDutyStaffCount, minimumOnDutyStaff and eligibleForBookings.
export const setBusinessAvailability = async (isAvailable) => {
  const { data } = await api.put("/businesses/availability", { isAvailable });
  return data?.data || data;
};

// Every staff account (INVITED, ACTIVE, DECLINED, EXPIRED, REMOVED), paginated.
export const getBusinessStaff = async (businessId, params = {}) => {
  const { data } = await api.get(`/business/${businessId}/staff`, { params });
  return data?.data || data;
};

// payload: { email, role, services, canDoHomeService }; services must be the
// business's own service names.
export const inviteBusinessStaff = async (businessId, payload) => {
  const { data } = await api.post(`/business/${businessId}/invite`, payload);
  return data?.data || data;
};

// Bookings made to this business, newest first. Optional `status` and
// `businessStatus` (needs_staff, assigned, in_progress, completed, cancelled).
export const getBusinessBookings = async (businessId, params = {}) => {
  const { data } = await api.get(`/businesses/${businessId}/bookings`, { params });
  return { bookings: data?.data ?? [], total: data?.total ?? 0, totalPages: data?.totalPages ?? 1 };
};

// Not on the backend yet: path from the spec, bookingId sent in the body and
// PATCH to match the provider accept/decline routes. Adjust once it ships.
export const acceptBusinessBooking = async (businessId, bookingId) => {
  const { data } = await api.patch(`/businesses/${businessId}/accept`, { bookingId });
  return data?.data || data;
};

// Not on the backend yet: PATCH assumed, like the provider decline route.
export const declineBusinessBooking = async (bookingId) => {
  const { data } = await api.patch(`/businesses/bookings/${bookingId}/decline`);
  return data?.data || data;
};

// Active staff annotated with eligibility, distance and ETA for this booking.
export const getBookingStaffCandidates = async (businessId, bookingId) => {
  const { data } = await api.get(`/business/${businessId}/bookings/${bookingId}/staff-candidates`);
  return data?.data || data;
};

// Additive: each call assigns one more staff member.
export const assignBookingStaff = async (businessId, bookingId, staffId) => {
  const { data } = await api.put(`/business/${businessId}/bookings/${bookingId}/assign-staff`, { staffId });
  return data?.data || data;
};
