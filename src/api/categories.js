import api from "./axios";

export const getServiceCategories = async () => {
  const { data } = await api.get("/categories");
  return data?.data || [];
};
