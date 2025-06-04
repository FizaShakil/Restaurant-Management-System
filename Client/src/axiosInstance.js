import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true, // if using cookies
});

// Automatically attach token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // or from Redux/cookies
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;

