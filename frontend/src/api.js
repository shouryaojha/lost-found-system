import axios from "axios";

// Base API URL — points to your Express backend
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Automatically attach JWT token to every request (if logged in)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
