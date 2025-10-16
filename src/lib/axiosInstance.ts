// src/lib/axiosInstance.ts
import axios, { AxiosError } from "axios";
import { store } from "@/redux/store";
import { logout } from "@/redux/features/authSlice";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.bitechx.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 Attach JWT token before every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Handle expired token or errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Optional: Auto logout on invalid token
      store.dispatch(logout());
      console.warn("Unauthorized. Logging out...");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
