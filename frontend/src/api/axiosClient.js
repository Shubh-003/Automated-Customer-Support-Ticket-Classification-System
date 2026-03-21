/*
axiosClient.js

Central API client for all backend calls.

- Uses environment variable for base URL
- Automatically attaches JWT token
*/

import axios from "axios";

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

// Attach token to every request
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosClient;