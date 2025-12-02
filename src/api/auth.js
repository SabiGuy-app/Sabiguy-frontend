import api from "./axios";


// LOGIN (email + password)
export const login = async (payload) => {
  const { data } = await api.post('/auth', payload);
  return data;
};

// GET USER BY EMAIL
export const getUserByEmail = async (email) => {
  const token = localStorage.getItem("token");

  const { data } = await api.get(
    `/users/email/${email}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};

// GOOGLE LOGIN
export const googleLogin = async (accessToken) => {
  const { data } = await api.post(`/auth/google-login`, {
    token: accessToken,
  });
  return data;
};