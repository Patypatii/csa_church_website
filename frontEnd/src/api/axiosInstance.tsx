import axios from "axios";
import { LocalStorage } from "../utils";

// Create an Axios instance for API requests
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI,
  withCredentials: true,
  timeout: 120000,
});


// Add an interceptor to set authorization header
apiClient.interceptors.request.use(
  (config) => {
    const userdata =LocalStorage.get('userdata');
    if (userdata && userdata.accessToken) {
      config.headers.Authorization = `Bearer ${userdata.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized (Token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const userdata = LocalStorage.get('userdata');
        if (!userdata || !userdata.refreshToken) {
          throw new Error("No refresh token available");
        }

        // Call refresh endpoint
        const { data } = await axios.post(`${import.meta.env.VITE_SERVER_URI}/authentication/v1/refresh`, {
          refreshToken: userdata.refreshToken
        });

        // Update userdata with new accessToken
        const updatedData = { ...userdata, accessToken: data.accessToken };
        localStorage.setItem("userdata", JSON.stringify(updatedData));

        // Retry original request
        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      } catch (err) {
        // Refresh failed → logout
        localStorage.removeItem("userdata");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);


export const loginApi = (data: { userReg: string; password: string }) => {
  return apiClient.post("/authentication/v1/login", data);
};

// API functions
export const generateAndSaveQuestions = (data: { topic: string }) => {
  return apiClient.post("/questions/v1", data);
};

export const initiateSTKPush = (data: { amount: number; phoneNumber: string }) => {
  return apiClient.post("/authentication/v1/stk-push", data);
};

export const initiateGuestSTKPush = (data: { amount: number; phoneNumber: string }) => {
  return apiClient.post("/authentication/v1/stk-push-guest", data);
};

export const getSTKPushStatus = (checkoutId: string) => {
  return apiClient.get(`/authentication/v1/stk-push-status/${checkoutId}`);
};