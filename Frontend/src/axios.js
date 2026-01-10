import axios from "axios";
import { getApiBaseUrl } from "./lib/utils.js";

const api = axios.create({
  // 🔴 BACKEND BASE URL (Render) - Use environment variable
  baseURL: getApiBaseUrl(),

  // 🔑 VERY IMPORTANT FOR COOKIE AUTH
  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: response interceptor (debug help)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "API Error:",
      error.response?.status,
      error.response?.data
    );
    return Promise.reject(error);
  }
);

export default api;
