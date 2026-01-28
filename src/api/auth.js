import api from "./axios";
import { removeFCMToken } from "./fcm";


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

export async function handleLogout() {
  try {
    // Remove FCM token from backend
    await removeFCMToken();
    
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear Zustand store
    useAuthStore.getState().clearAuth();
    
    // Redirect to login
    navigate('/login');
  } catch (error) {
    console.error('Logout error:', error);
    // Still logout even if FCM removal fails
    localStorage.removeItem('token');
    navigate('/login');
  }
}
