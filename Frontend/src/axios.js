import axios from "axios";

const api = axios.create({
  // 🔴 BACKEND BASE URL (Render)
  baseURL: "https://e-learning-management-system-l5yo.onrender.com",

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
