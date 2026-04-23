import axios from "axios";

// Base API URL — points to deployed backend on Render
const API = axios.create({
  baseURL: "https://lost-found-system-k7ga.onrender.com/api",
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
