import api from "./axios";

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
