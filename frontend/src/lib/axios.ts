import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api", // will be proxied via vite to http://localhost:5000/api
  withCredentials: true, // critical for cookie-based authentication
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default axiosInstance;
