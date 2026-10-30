import api from "./axios";

export const getAllBusinesses = async (params = {}) => {
  const { data } = await api.get("/businesses/getAllBusinesses", { params });
  return data;
};

export const getBusinessById = async (businessId) => {
  const { data } = await api.get(`/businesses/${businessId}`);
  return data;
};

export const requestStaffClockIn = async (businessId) => {
  const { data } = await api.post("/business/staff/clock-in", { businessId });
  return data;
};

export const requestStaffClockOut = async (businessId) => {
  const { data } = await api.post("/business/staff/clock-out", { businessId });
  return data;
};

export const saveBusinessServiceDetails = async (serviceDetails) => {
  const { data } = await api.post(
    "/businesses/service-details",
    serviceDetails,
  );
  return data;
};

export const uploadBusinessWorkVisual = async (email, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post(
    `/file/${encodeURIComponent(email)}/work_visuals`,
    formData,
  );
  return data?.file?.url;
};
