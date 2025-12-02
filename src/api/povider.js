import api from "./axios";

export const getAllProviders = async (token) => {
    // const token = localStorage.getItem("token");

  const { data } = await api.get('/users/providers',
   {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data; 
};