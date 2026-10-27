import api from "../../../api/axios";


export const getBusinessByEmail = async (email) => {
  const { data } = await api.get("/businesses/by-email", {
    params:{email},
  });
  return data?.data || data;
};